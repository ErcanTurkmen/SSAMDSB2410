import libCom from '../../../Common/Library/CommonLibrary';
import ODataDate from '../../../Common/Date/ODataDate';
import { GetOpenItemsTargetQuery } from './BulkUpdateLibrary';
import libVal from '../../../Common/Library/ValidationLibrary';
import { InventoryOrderTypes, GoodsMovementCode } from '../../Common/Library/InventoryLibrary';
import IsStorageLocationReadOnly from './EDT/IsStorageLocationReadOnly';

const MOVEMENT_INDICATOR_PO_RECEIPT = 'B';

export default function BulkIssueOrReceiptGenericFieldsPost(context) {

    let binding = context.binding;
    const type = binding['@odata.type'].substring('#sap_mobile.'.length);
    const queryTarget = GetOpenItemsTargetQuery(type, binding);
    const target = queryTarget.target;
    const query = getOpenItemsQuery(type, queryTarget.query);

    setMaterialDocumentHeaderValues(context, binding, type);

    // Read all open line items
    return context.read('/SAPAssetManager/Services/AssetManager.service', target, [], query).then(function(results) {
        if (libVal.evalIsEmpty(results)) {
            return false;
        }
        let itemArray = Array.from(results);
        //Create the material document header
        return context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/IssueOrReceiptMaterialDocumentCreate.action').then((response) => {
            libCom.setStateVariable(context, 'MaterialDocumentBulkUpdate', JSON.parse(response.data));
            libCom.setStateVariable(context, 'MaterialDocNumberBulkUpdate', JSON.parse(response.data).MaterialDocNumber);
            libCom.setStateVariable(context, 'MaterialDocYearBulkUpdate', JSON.parse(response.data).MaterialDocYear);
            libCom.setStateVariable(context, 'skipToastAndClosePageOnDocumentCreate', true);
            // Create the items in a loop
            return CreateMaterialDocumentItemLoop(context, itemArray, 0).then(() => {
                libCom.removeStateVariable(context, 'IssueAllItemId');
                libCom.removeStateVariable(context, 'ReceiveAllItemId');
                return true;
            });
        });
    });
}

export async function CreateMaterialDocumentItemLoop(context, items, itemLine) {

    let binding = context.binding;
    const row = items[0];
   
    itemLine++; 
    //Line item (fields from screen)
    binding.TempLine_MovementType = libCom.getListPickerValue(libCom.getControlProxy(context, 'MovementTypePicker').getValue());
    binding.TempLine_SpecialStockInd = libCom.getListPickerValue(libCom.getControlProxy(context, 'SpecialStockIndicatorPicker').getValue());
    binding.TempLine_StorageLocation = await IsStorageLocationReadOnly(context, row) ? '' : libCom.getListPickerValue(libCom.getControlProxy(context, 'StorageLocationPicker').getValue()); //If item is free text of non-stock then don't copy
    binding.TempLine_StockType = libCom.getListPickerValue(libCom.getControlProxy(context, 'StockTypePicker').getValue());
    if (binding.TempLine_StockType === 'UNRESTRICTED') {
        binding.TempLine_StockType = ''; //Unrestricted has value of 'UNRESTRICTED' to accomodate picker, but needs to be set to '' for database
    }
    binding.TempLine_GoodsReceipient = libCom.getControlProxy(context, 'GoodsRecipientSimple').getValue();
    binding.TempLine_UnloadingPoint = libCom.getControlProxy(context, 'UnloadingPointSimple').getValue();

    // Get other item type specific fields
    GetMaterialDocumentItemSpecificValues(context, row, itemLine);

    //Create the material document item
    return context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/IssueOrReceiptMaterialDocumentItemCreate.action').then(() => {
            items.shift(); // Drop the first row in the array as the function CreateMaterialDocumentItemLoop always processes first item in the array and recursively calls to create material doc item for next items
            if (items.length > 0) {
                return CreateMaterialDocumentItemLoop(context, items, itemLine); //Recursively process the next item
            }
            return Promise.resolve(true); //No more items
        });
}

function GetMaterialDocumentItemSpecificValues(context, row, itemLine) {
    const movementType = libCom.getStateVariable(context, 'IMMovementType');
    const objectType = libCom.getStateVariable(context, 'IMObjectType');
    let binding = context.binding;

    if (movementType === 'I') {
        //Line item - common values
        binding.TempLine_MovementIndicator = '';
        binding.TempLine_Batch = '';
        binding.TempLine_AutoGenerateSerialNumbers = '';
        binding.TempLine_Vendor = '';
        binding.TempLine_ItemText = '';
        binding.TempLine_Material = row.MaterialNum;
        binding.TempItem_ItemReadLink = row['@odata.readLink'];
        binding.TempLine_OldQuantity = 0;

        if (objectType === InventoryOrderTypes.RES || objectType === InventoryOrderTypes.PRD) {
            setMaterialDocumentItemValuesForReservationAndProductionOrderIssue(context, binding, row);
        } else if (objectType === InventoryOrderTypes.STO) {
            setMaterialDocumentItemValuesForSTOIssue(context, binding, row);
        }
        libCom.setStateVariable(context, 'IssueAllItemId', itemLine.toString().padStart(4, '0'));

    } else if (movementType === 'R' && objectType === InventoryOrderTypes.PO) {
        setMaterialDocumentItemValuesForPOReceipt(context, binding, row, itemLine);
    }
}

function getGMCode(type) {
    let gmCode = '';
    if (type === 'PurchaseOrderHeader') {
       gmCode = GoodsMovementCode.GoodsReceiptPO;
    } else if (type === 'ReservationHeader' || type === 'ProductionOrderHeader') {
        gmCode = GoodsMovementCode.GoodsIssue;
    } else if (type === 'StockTransportOrderHeader') {
        gmCode = GoodsMovementCode.TransferPosting;
    }
    return gmCode;
}

function getOpenItemsQuery(type, query) {
    let itemsQuery = query + '&$orderby=ItemNum';
    if (type === 'PurchaseOrderHeader') {
        itemsQuery += '&$expand=ScheduleLine_Nav';
    } else if (type === 'StockTransportOrderHeader') {
        itemsQuery += '&$expand=STOScheduleLine_Nav';
    }
    return itemsQuery;
}


function setMaterialDocumentItemValuesForPOReceipt(context, binding, row, itemLine) {
    binding.TempLine_MovementIndicator = MOVEMENT_INDICATOR_PO_RECEIPT;
    binding.TempLine_EntryQuantity = Number(row.OpenQuantity);
    binding.TempLine_Batch = row.ScheduleLine_Nav[0].Batch;
    binding.TempLine_AutoGenerateSerialNumbers = '';
    binding.TempLine_StorageLocation = row.StorageLoc || binding.TempLine_StorageLocation;
    binding.TempLine_StockType = row.StockType || binding.TempLine_StockType;
    binding.TempLine_ItemText = '';
    binding.TempItem_ItemReadLink = row['@odata.readLink'];
    binding.TempLine_PurchaseOrderNumber = row.PurchaseOrderId;
    binding.TempLine_PurchaseOrderItem = row.ItemNum;
    binding.TempLine_Material = row.MaterialNum;
    binding.TempLine_EntryUOM = row.OrderUOM;
    binding.TempLine_Plant = row.Plant;
    binding.TempItem_OpenQuantity = Number(row.OpenQuantity);
    binding.TempItem_ReceivedQuantity = Number(row.ReceivedQuantity);
    libCom.setStateVariable(context, 'ReceiveAllItemId', itemLine.toString().padStart(4, '0'));

    binding.TempLine_GLAccount = row.GLAccount;
    binding.TempLine_CostCenter = row.CostCenter;
    binding.TempLine_WBSElement = row.WBSElement;
    binding.TempLine_Order = row.Order;
    binding.TempLine_Network = row.Network;
    binding.TempLine_Activity = row.NetworkActivity;
}

function setMaterialDocumentItemValuesForReservationAndProductionOrderIssue(context, binding, row) {
    binding.TempLine_ReservationNumber = row.ReservationNum || row.Reservation;
    binding.TempLine_ReservationItem = row.ItemNum;
    binding.TempLine_EntryUOM = row.RequirementUOM;
    binding.TempLine_Plant = row.SupplyPlant;
    binding.TempLine_RecordType = row.RecordType;
    binding.TempLine_StockType = '';
    binding.TempLine_StorageLocation = row.SupplyStorageLocation || binding.TempLine_StorageLocation;
    binding.TempLine_Order = row.OrderId;
    binding.TempLine_CostCenter = context.binding.CostCenter;
    binding.TempLine_GLAccount = row.GLAccount;
    binding.TempItem_OpenQuantity = Number(row.RequirementQuantity) - Number(row.WithdrawalQuantity);
    binding.TempItem_ReceivedQuantity = Number(row.WithdrawalQuantity);
    binding.TempLine_EntryQuantity = Number(row.RequirementQuantity) - Number(row.WithdrawalQuantity);

    binding.TempLine_WBSElement = row.WBSElement;
    binding.TempLine_Order = row.OrderId || '';
    binding.TempLine_Network = context.binding.Network || '';
    binding.TempLine_Activity = row.ActivityNum || '';
    binding.TempLine_Batch = row.Batch;

}

function setMaterialDocumentItemValuesForSTOIssue(context, binding, row) {
    binding.TempLine_PurchaseOrderNumber = row.StockTransportOrderId;
    binding.TempLine_PurchaseOrderItem = row.ItemNum;
    binding.TempLine_EntryUOM = row.OrderUOM;
    binding.TempLine_Plant = context.binding.SupplyingPlant; //Issue so use supply plant
    binding.TempLine_StockType = row.StockType || binding.TempLine_StockType;
    binding.TempLine_StorageLocation = row.StorageLoc || binding.TempLine_StorageLocation;
    binding.TempItem_OrderQuantity = Number(row.OrderQuantity);
    binding.TempItem_OpenQuantity = Number(row.OpenQuantity);
    binding.TempItem_ReceivedQuantity = Number(row.ReceivedQuantity);
    binding.TempItem_IssuedQuantity = Number(row.IssuedQuantity);
    binding.TempLine_EntryQuantity = Number(row.OrderQuantity) - Number(row.IssuedQuantity);
    binding.TempLine_Batch = row.STOScheduleLine_Nav?.[0]?.Batch || '';
}

function setMaterialDocumentHeaderValues(context, binding, type) {
    binding.TempHeader_DocumentDate = new ODataDate().toLocalDateString();
    binding.TempHeader_MaterialDocYear = new ODataDate().toDBDate(context).getFullYear().toString();
    binding.TempHeader_PostingDate = new ODataDate(libCom.getControlProxy(context, 'PostingDate').getValue()).toLocalDateString();
    binding.TempHeader_HeaderText = libCom.getControlProxy(context, 'HeaderTextSimple').getValue();
    binding.TempHeader_DeliveryNote = libCom.getControlProxy(context, 'DeliveryNoteSimple').getValue();
    binding.TempHeader_UserName = libCom.getSapUserName(context);
    binding.TempHeader_GMCode = getGMCode(type);
}
