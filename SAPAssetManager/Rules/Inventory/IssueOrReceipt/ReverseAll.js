import libCom from '../../Common/Library/CommonLibrary';
import ODataDate from '../../Common/Date/ODataDate';
import { GoodsMovementCode } from '../Common/Library/InventoryLibrary';
export default function Reverseall(context) {
    let binding = context.binding;
    //Material document header fields (some from screen)
    binding.TempHeader_DocumentDate = new ODataDate(libCom.getControlProxy(context, 'DocumentDate').getValue()).toLocalDateString();
    binding.TempHeader_MaterialDocYear = new ODataDate(libCom.getControlProxy(context, 'DocumentDate').getValue()).toDBDate(context).getFullYear().toString();
    binding.TempHeader_PostingDate = new ODataDate(libCom.getControlProxy(context, 'PostingDate').getValue()).toLocalDateString();
    binding.TempHeader_HeaderText = libCom.getControlProxy(context, 'HeaderTextSimple').getValue();
    binding.TempHeader_DeliveryNote = libCom.getControlProxy(context, 'DeliveryNoteSimple').getValue();
    binding.TempHeader_UserName = libCom.getSapUserName(context);

    const query = `$filter=ReferenceDocHdr eq '${binding.MaterialDocNumber}' and ReferenceDocYear eq '${binding.MaterialDocYear}'`;
    const queryMat = `$filter=MaterialDocNumber eq '${binding.MaterialDocNumber}' and MaterialDocYear eq '${binding.MaterialDocYear}'`;
    const docItems = context.read('/SAPAssetManager/Services/AssetManager.service', 'MaterialDocItems', [], queryMat);
    const reverseItems= context.read('/SAPAssetManager/Services/AssetManager.service', 'MaterialDocItems', [], query);
    return Promise.all([docItems, reverseItems]).then(([items, reverseDocs]) =>{
        const reverseDocsByReferenceDocItem = new Map(reverseDocs.map(i => ([i.ReferenceDocItem, i])));
        const itemArray = items.filter(item => !reverseDocsByReferenceDocItem.get(item.MatDocItem));
        //Create the material document header
        return context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/IssueOrReceiptMaterialDocumentCreate.action')
        .then((response) => {
            libCom.setStateVariable(context, 'MaterialDocumentBulkUpdate', JSON.parse(response.data));
            libCom.setStateVariable(context, 'MaterialDocNumberBulkUpdate', JSON.parse(response.data).MaterialDocNumber);
            libCom.setStateVariable(context, 'MaterialDocYearBulkUpdate', JSON.parse(response.data).MaterialDocYear); 
        }).then(() => {
            //Create the items in a loop
            return CreateMaterialDocumentItemLoop(context, itemArray, 0).then(() => {
                libCom.removeStateVariable(context, 'ReverseAllItemId');
                return context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/DocumentCreateSuccessWithClose.action');
                });
        });               
    });
}

function prepareBinding(context, binding, row, itemLine) {
    binding.TempLine_MovementIndicator = '';
    binding.TempLine_Material = row.Material;
    binding.TempItem_ItemReadLink = row['@odata.readLink'];
    binding.TempLine_OldQuantity = 0;
    binding.TempLine_EntryQuantity = row.EntryQuantity;
    binding.TempLine_EntryUOM = row.EntryUOM;
    binding.TempLine_ReferenceDocHdr = row.MaterialDocNumber;
    binding.TempLine_ReferenceDocItem = row.MatDocItem;
    binding.TempLine_ReferenceDocYear = row.MaterialDocYear;
    binding.TempLine_MovementType = String(Number(row.MovementType) + 1);
    binding.TempHeader_GMCode = GoodsMovementCode.Reversal;
    binding.TempLine_Plant = row.Plant;
    binding.TempLine_StorageLocation = row.StorageLocation;
    binding.TempLine_QuantityInBaseUOM = binding.TempLine_EntryQuantity;
    binding.TempLine_PurchaseOrderNumber = row.PurchaseOrderNumber;
    binding.TempLine_PurchaseOrderItem = row.PurchaseOrderItem;
    binding.TempLine_ReservationNumber = row.ReservationNumber;
    binding.TempLine_ReservationItem = row.ReservationItemNumber;
    binding.TempLine_BaseUOM = row.UOM;
    binding.TempLine_GoodsReceipient = row.GoodsRecipient;
    binding.TempLine_AutoGenerateSerialNumbers = row.AutoGenerateSerialNumbers;
    binding.TempLine_MovementIndicator = row.MovementIndicator;
    binding.TempLine_DeliveryComplete = row.FinalIssue;
    binding.TempLine_ItemText = row.ItemText;
    binding.TempLine_UnloadingPoint = row.UnloadingPoint;
    binding.TempLine_GLAccount = row.GLAccount;
    binding.TempLine_CostCenter = row.CostCenter;
    binding.TempLine_WBSElement = row.WBSElement;
    binding.TempLine_Order = row.OrderNumber;
    binding.TempLine_Network = row.Network;
    binding.TempLine_Activity = row.NetworkActivity;
    binding.TempLine_Batch = row.Batch;
    binding.TempLine_StockType = row.StockType;
    binding.TempLine_ValuationType = row.ValuationType;
    binding.TempLine_StorageBin = row.StorageBin;
    binding.TempLine_ToPlant = row.MovePlant;
    binding.TempLine_ToStorageLocation = row.MoveStorageLocation;
    binding.TempLine_ToBatch = row.MoveBatch;
    binding.TempLine_MovementReason = row.MovementReason;
    binding.TempLine_NumOfLabels = row.NumOfLabels;
    binding.TempLine_SpecialStockInd = row.SpecialStockInd;
    binding.TempLine_Vendor = row.Vendor;
    binding.TempLine_SalesOrderNumber = row.SalesOrderNumber;
    binding.TempLine_SalesOrderItem = row.SalesOrderItem;
    libCom.setStateVariable(context, 'ReverseAllItemId', itemLine.toString().padStart(4, '0'));
}

//Loop over material doc items and create material document items for cancellation
export function CreateMaterialDocumentItemLoop(context, items, itemLine) {
    return items.reduce((prevCreatePromise, currentItem) => {
        return prevCreatePromise.then(() => {
            //Line item
            itemLine++; //Keep track of the line number because of the changeset
            prepareBinding(context, context.binding, currentItem, itemLine);
            return context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/IssueOrReceiptMaterialDocumentItemCreate.action');
        });
    }, Promise.resolve());
}
