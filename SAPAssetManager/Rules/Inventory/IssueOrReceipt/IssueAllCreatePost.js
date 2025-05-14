import libCom from '../../Common/Library/CommonLibrary';
import ODataDate from '../../Common/Date/ODataDate';
import IssueOrReceiptItemUpdate from './IssueOrReceiptItemUpdate';
import { MovementTypes } from '../Common/Library/InventoryLibrary';

export default function IssueAllCreatePost(context) {

    let binding = context.binding;
    let type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
    let query;
    let target;

    //Material document header fields (some from screen)
    binding.TempHeader_DocumentDate = new ODataDate(libCom.getControlProxy(context, 'DocumentDate').getValue()).toLocalDateString();
    binding.TempHeader_MaterialDocYear = new ODataDate(libCom.getControlProxy(context, 'DocumentDate').getValue()).toDBDate(context).getFullYear().toString();
    binding.TempHeader_PostingDate = new ODataDate(libCom.getControlProxy(context, 'PostingDate').getValue()).toLocalDateString();
    binding.TempHeader_HeaderText = libCom.getControlProxy(context, 'HeaderTextSimple').getValue();
    binding.TempHeader_DeliveryNote = libCom.getControlProxy(context, 'DeliveryNoteSimple').getValue();
    binding.TempHeader_UserName = libCom.getSapUserName(context);

    if (type === 'ReservationHeader') {
        binding.TempHeader_GMCode = '03';
        let resNumber = context.binding.ReservationNum;
        query = "$filter=ReservationNum eq '" + resNumber + "' and Completed ne 'X' and SupplyStorageLocation ne ''";
        query += ' and (RequirementQuantity gt WithdrawalQuantity)';
        target = 'ReservationItems';
    } else if (type === 'StockTransportOrderHeader') {
        binding.TempHeader_GMCode = '04';
        let stoNumber = context.binding.StockTransportOrderId;
        query = '$expand=StockTransportOrderHeader_Nav';
        query += "&$filter=StockTransportOrderId eq '" + stoNumber + "' and DeliveryCompletedFlag ne 'X' and FinalDeliveryFlag ne 'X' and StorageLoc ne ''";
        query += ' and (OrderQuantity gt IssuedQuantity)';
        target = 'StockTransportOrderItems';
    } else if (type === 'ProductionOrderHeader') {
        binding.TempHeader_GMCode = '03';
        let orderNumber = context.binding.OrderId;
        query = "$filter=OrderId eq '" + orderNumber + "' and Completed ne 'X' and SupplyStorageLocation ne ''";
        query += ' and (RequirementQuantity gt WithdrawalQuantity)';
        target = 'ProductionOrderComponents';
    }

    query += " and MaterialPlant_Nav/BatchIndicator eq '' and MaterialPlant_Nav/SerialNumberProfile eq ''";
    query += '&$orderby=ItemNum';

    //Read all lines that are able to be issued
    return context.read('/SAPAssetManager/Services/AssetManager.service', target, [], query).then(function(results) {
        if (results && results.length > 0) {
            let itemArray = [];
            results.forEach(function(row) {
                itemArray.push(row);
            });
            //Create the material document header
            return context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/IssueOrReceiptMaterialDocumentCreate.action').then(() => {
                //Create the items in a loop
                return CreateMaterialDocumentItemLoop(context, itemArray, 0).then(() => {
                    libCom.removeStateVariable(context, 'IssueAllItemId');
                    return context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/DocumentCreateSuccessWithClose.action');
                });
            });
        }
        return false; //Nothing to receive
    });
}

//Loop over RES/STO/PRD items and create material document items
export function CreateMaterialDocumentItemLoop(context, items, itemLine) {

    let binding = context.binding;
    let row = items[0];
    let type = row['@odata.type'].substring('#sap_mobile.'.length);

    itemLine++; //Keep track of the line number because of the changeset

    //Line item
    binding.TempLine_MovementIndicator = '';
    binding.TempLine_Batch = '';
    binding.TempLine_AutoGenerateSerialNumbers = '';
    binding.TempLine_SpecialStockInd = '';
    binding.TempLine_Vendor = '';
    binding.TempLine_ItemText = '';
    binding.TempLine_UnloadingPoint = '';
    binding.TempLine_Material = row.MaterialNum;

    binding.TempItem_ItemReadLink = row['@odata.readLink'];
    binding.TempLine_OldQuantity = 0;

    if (type === 'ReservationItem' || type === 'ProductionOrderComponent') {
        binding.TempLine_MovementType = MovementTypes.t261;
        binding.TempLine_ReservationNumber = row.ReservationNum || row.Reservation;
        binding.TempLine_ReservationItem = row.ItemNum;
        binding.TempLine_EntryUOM = row.RequirementUOM;
        binding.TempLine_Plant = row.SupplyPlant;
        binding.TempLine_RecordType = row.RecordType;
        binding.TempLine_StockType = '';
        binding.TempLine_StorageLocation = row.SupplyStorageLocation;
        binding.TempLine_Order = row.OrderId;
        binding.TempLine_CostCenter = context.binding.CostCenter;
        binding.TempLine_GLAccount = row.GLAccount;
        //Item values to update the reservationItem reflecting this issue
        binding.TempItem_OpenQuantity = Number(row.RequirementQuantity) - Number(row.WithdrawalQuantity);
        binding.TempItem_ReceivedQuantity = row.WithdrawalQuantity;
        binding.TempLine_EntryQuantity = Number(row.RequirementQuantity) - Number(row.WithdrawalQuantity);
    } else if (type === 'StockTransportOrderItem') {
        binding.TempLine_MovementType = '351';
        binding.TempLine_PurchaseOrderNumber = row.StockTransportOrderId;
        binding.TempLine_PurchaseOrderItem = row.ItemNum;
        binding.TempLine_EntryUOM = row.OrderUOM;
        binding.TempLine_Plant = row.StockTransportOrderHeader_Nav.SupplyingPlant; //Issue so use supply plant
        binding.TempLine_StockType = row.StockType;
        binding.TempLine_StorageLocation = row.StorageLoc;
        //Item values to update the STO reflecting this issue
        binding.TempItem_OrderQuantity = row.OrderQuantity;
        binding.TempItem_OpenQuantity = row.OpenQuantity;
        binding.TempItem_ReceivedQuantity = row.ReceivedQuantity;
        binding.TempItem_IssuedQuantity = row.IssuedQuantity;
        binding.TempLine_EntryQuantity = Number(row.OrderQuantity) - Number(row.IssuedQuantity);
    }
    binding.TempLine_QuantityInBaseUOM = binding.TempLine_EntryQuantity;
    libCom.setStateVariable(context, 'IssueAllItemId', itemLine.toString().padStart(4, '0'));

    //Create the material document item
    return context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/IssueOrReceiptMaterialDocumentItemCreate.action').then(() => {
        //Update the RES/STO/PRD Item counts
        return IssueOrReceiptItemUpdate(context).then(() => {
            //Continue looping
            items.shift(); //Drop the first row in the array
            if (items.length > 0) {
                return CreateMaterialDocumentItemLoop(context, items, itemLine); //Recursively process the next item
            }
            return Promise.resolve(true); //No more items
        });
    });
}
