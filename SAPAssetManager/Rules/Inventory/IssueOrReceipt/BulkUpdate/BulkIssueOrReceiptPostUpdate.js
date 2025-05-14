
import IssueOrReceiptItemUpdate from '../IssueOrReceiptItemUpdate';
import libCom from '../../../Common/Library/CommonLibrary';

export default function BulkIssueOrReceiptPostUpdate(context) {
    const items = getUpdatedItemsFromEDT(context);
    const itemsUpdated = items.filter((item) => item.Properties.ItemSelection);
    
    return context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/IssueOrReceiptMaterialDocumentUpdate.action').then(() =>  {
        return UpdateMaterialDocumentItemInLoop(context, itemsUpdated);
    });
}

export function UpdateMaterialDocumentItemInLoop(context, items) {
    return items.reduce((prevUpdatePromise, item) => {
        return prevUpdatePromise.then(() => {
            let binding = context.binding;
            let row = item.OdataBinding;
            binding.TempLine_MatDocItemReadLink = row['@odata.readLink'];
            binding.TempHeader_Key = binding.TempHeader_Key || row.MaterialDocNumber;
            binding.TempHeader_MaterialDocYear = row.MaterialDocYear;
            binding.TempLine_GoodsReceipient = row.GoodsRecipient;
            binding.TempLine_EntryUOM = row.UOM;
            binding.TempLine_AutoGenerateSerialNumbers = row.AutoGenerateSerialNumbers;
            binding.TempLine_DeliveryComplete = row.FinalIssue;
            binding.TempLine_ItemText = row.ItemText;
            binding.TempLine_Material = row.Material;
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
            binding.TempLine_ReferenceDocHdr = row.ReferenceDocHdr;
            binding.TempLine_ReferenceDocYear = row.ReferenceDocYear;
            binding.TempLine_ReferenceDocItem = row.ReferenceDocItem;
            binding.TempLine_NumOfLabels = row.NumOfLabels;
            binding.TempLine_SpecialStockInd = row.SpecialStockInd;
            binding.TempLine_Vendor = row.Vendor;
            binding.TempLine_SalesOrderNumber = row.SalesOrderNumber;
            binding.TempLine_SalesOrderItem = row.SalesOrderItem;
            binding.TempLine_OldQuantity = 0;
            binding.TempLine_MovementType = row.MovementType;
            // Values from EDT
            binding.TempLine_StorageLocation = item.Properties.StorageLocation;
            binding.TempLine_EntryQuantity = item.Properties.Quantity;
            binding.TempLine_EntryUOM = item.Properties.UOM || row.EntryUOM;
            
            binding.TempLine_QuantityInBaseUOM = item.OdataBinding.TempLine_QuantityInBaseUOM;

            setQuantitiesAndReadLinkForDocument(binding, row);            
        })
        .then(() => context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/IssueOrReceiptMaterialDocumentItemUpdate.action'))
        .then(() => IssueOrReceiptItemUpdateIsRequired(context));
    }, Promise.resolve());
}

export function getUpdatedItemsFromEDT(context) {
    let sections = context.getPageProxy().getControls()[0].getSections();
    let itemsArray = [];
    for (let index = 2; index < sections.length; index += 2) {
        let section = sections[index];
        itemsArray.push(section.getExtension().getAllValues()[0]);
    }
    return itemsArray;
}


function IssueOrReceiptItemUpdateIsRequired(context) {
    if (!libCom.getStateVariable(context, 'BulkUpdateFinalSave')) {
        return Promise.resolve(true);
    }
    return IssueOrReceiptItemUpdate(context);
}

export function setQuantitiesAndReadLinkForDocument(binding, item) {
    if (item.PurchaseOrderItem_Nav) {
        binding.TempItem_ItemReadLink = item.PurchaseOrderItem_Nav['@odata.readLink'];
        binding.TempItem_OpenQuantity = Number(item.PurchaseOrderItem_Nav.OpenQuantity);
        binding.TempItem_ReceivedQuantity = Number(item.PurchaseOrderItem_Nav.ReceivedQuantity);
    } else if (item.StockTransportOrderItem_Nav) {
        binding.TempItem_ItemReadLink = item.StockTransportOrderItem_Nav['@odata.readLink'];
        binding.TempItem_OrderQuantity = Number(item.StockTransportOrderItem_Nav.OrderQuantity);
        binding.TempItem_ReceivedQuantity = Number(item.StockTransportOrderItem_Nav.ReceivedQuantity);
        binding.TempItem_IssuedQuantity = Number(item.StockTransportOrderItem_Nav.IssuedQuantity);
        binding.TempItem_OpenQuantity = Number(item.StockTransportOrderItem_Nav.OpenQuantity); 
    } else if (item.ReservationItem_Nav) {
        binding.TempItem_ItemReadLink = item.ReservationItem_Nav['@odata.readLink'];
        binding.TempItem_OpenQuantity = Number(item.ReservationItem_Nav.RequirementQuantity) - Number(item.ReservationItem_Nav.WithdrawalQuantity);
        binding.TempItem_ReceivedQuantity = Number(item.ReservationItem_Nav.WithdrawalQuantity);
    } else if (item.ProductionOrderComponent_Nav) {
        binding.TempItem_ItemReadLink = item.ProductionOrderComponent_Nav['@odata.readLink'];
        binding.TempItem_OpenQuantity = Number(item.ProductionOrderComponent_Nav.RequirementQuantity);
        binding.TempItem_ReceivedQuantity = Number(item.ProductionOrderComponent_Nav.WithdrawalQuantity);
    }
}
