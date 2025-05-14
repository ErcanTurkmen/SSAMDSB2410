import libCom from '../../Common/Library/CommonLibrary';
import EnableInventoryClerk from '../../SideDrawer/EnableInventoryClerk';
import allowIssue from '../StockTransportOrder/AllowIssueForSTO';
import reloadMaterialDocumentItem from './ReloadMaterialDocumentItem';
import ExecuteActionWithAutoSync from '../../ApplicationEvents/AutoSync/ExecuteActionWithAutoSync';
import GetMaterialUOM from '../../Inventory/Common/GetMaterialUOM';
/**
 *
 * Update the inventory item object quantities after mat doc item delete
 */
export default function UpdateInventoryDuringMatDocItemDelete(context, item, matDocTemp) {

    // context.binding is set on the upper levev function, so we don't need do this here,
    // using binding from matDocTemp field
    let binding = matDocTemp;
    let docBinding = matDocTemp;
    if (!binding && context.binding) {
        binding = context.binding?.item || context.binding;
        docBinding = context.binding?.item || context.binding;
    }
    let action;
    let readLink;

    if (item) {
        readLink = item['@odata.readLink'];
    }

    return reloadMaterialDocumentItem(context, readLink).then(function(newItem) {
        let isIM = EnableInventoryClerk(context);
        let closeBlocked = isIM && libCom.getStateVariable(context, 'NotClosePage');
        if (isIM) {
            libCom.setStateVariable(context, 'NotClosePage', false);
        }
        if (closeBlocked) {
            return Promise.resolve(true);
        }
        if (newItem) {
            binding = newItem;
        }
        docBinding.TempLine_OldQuantity = binding.EntryQuantity;
        docBinding.TempLine_EntryQuantity = 0;
        docBinding.TempLine_QuantityInBaseUOM = 0;
        return GetMaterialUOM(context, binding.Material, binding.EntryUOM).then(TempLine_MaterialUOM => {
            if (TempLine_MaterialUOM && TempLine_MaterialUOM.BaseUOM !== binding.EntryUOM) {
                docBinding.TempLine_OldQuantity = docBinding.TempLine_OldQuantity * TempLine_MaterialUOM?.ConversionFactor;
            }
            if (binding.PurchaseOrderItem_Nav) {
                libCom.setStateVariable(context, 'IMObjectType', 'PO');
                libCom.setStateVariable(context, 'IMMovementType', 'R');
                docBinding.TempLine_MovementType = binding.MovementType;
                docBinding.TempLine_DeliveryComplete = binding.DeliveryCompletedFlag;
                docBinding.TempItem_ItemReadLink = binding.PurchaseOrderItem_Nav['@odata.readLink'];
                docBinding.TempItem_OpenQuantity = Number(binding.PurchaseOrderItem_Nav.OpenQuantity);
                docBinding.TempItem_ReceivedQuantity = binding.PurchaseOrderItem_Nav.ReceivedQuantity;
                docBinding.TempItem_OpenQtyValBlocked = binding.PurchaseOrderItem_Nav.OpenQtyValBlocked;
                docBinding.TempItem_OpenQuantityBlocked = binding.PurchaseOrderItem_Nav.OpenQuantityBlocked;
                libCom.setStateVariable(context, 'TempItem', docBinding);
                action = '/SAPAssetManager/Actions/Inventory/IssueOrReceipt/IssueOrReceiptPurchaseOrderItemUpdate.action';
            } else if (binding.StockTransportOrderItem_Nav) {
                libCom.setStateVariable(context, 'IMObjectType', 'STO');
                if (allowIssue(binding.StockTransportOrderItem_Nav)) {
                    libCom.setStateVariable(context, 'IMMovementType', 'I');
                } else {
                    libCom.setStateVariable(context, 'IMMovementType', 'R');
                }
                docBinding.TempItem_ItemReadLink = binding.StockTransportOrderItem_Nav['@odata.readLink'];
                docBinding.TempItem_OrderQuantity = binding.StockTransportOrderItem_Nav.OrderQuantity;
                docBinding.TempItem_ReceivedQuantity = binding.StockTransportOrderItem_Nav.ReceivedQuantity;
                docBinding.TempItem_IssuedQuantity = binding.StockTransportOrderItem_Nav.IssuedQuantity;
                docBinding.TempItem_OpenQuantity = Number(binding.StockTransportOrderItem_Nav.OpenQuantity); //Not used for STO but variable is necessary
                libCom.setStateVariable(context, 'TempItem', docBinding);
                action = '/SAPAssetManager/Actions/Inventory/IssueOrReceipt/IssueOrReceiptSTOItemUpdate.action';
            } else if (binding.ReservationItem_Nav) {
                libCom.setStateVariable(context, 'IMObjectType', 'RES');
                libCom.setStateVariable(context, 'IMMovementType', 'I');
                docBinding.TempItem_ItemReadLink = binding.ReservationItem_Nav['@odata.readLink'];
                docBinding.TempItem_OpenQuantity = Number(binding.ReservationItem_Nav.RequirementQuantity) - Number(binding.ReservationItem_Nav.WithdrawalQuantity);
                docBinding.TempItem_ReceivedQuantity = binding.ReservationItem_Nav.WithdrawalQuantity;
                libCom.setStateVariable(context, 'TempItem', docBinding);
                action = '/SAPAssetManager/Actions/Inventory/IssueOrReceipt/IssueOrReceiptReservationItemUpdate.action';
            } else if (binding.ProductionOrderComponent_Nav) {
                libCom.setStateVariable(context, 'IMObjectType', 'PRD');
                libCom.setStateVariable(context, 'IMMovementType', 'I');
                docBinding.TempItem_ItemReadLink = binding.ProductionOrderComponent_Nav['@odata.readLink'];
                docBinding.TempItem_OpenQuantity = Number(binding.ProductionOrderComponent_Nav.RequirementQuantity) - Number(binding.ProductionOrderComponent_Nav.WithdrawalQuantity);
                docBinding.TempItem_ReceivedQuantity = Number(binding.ProductionOrderComponent_Nav.WithdrawalQuantity);
                libCom.setStateVariable(context, 'TempItem', docBinding);
                action = '/SAPAssetManager/Actions/Inventory/IssueOrReceipt/IssueOrReceiptReservationItemUpdate.action';
            } else if (binding.ProductionOrderItem_Nav) {
                libCom.setStateVariable(context, 'IMObjectType', 'PRD');
                libCom.setStateVariable(context, 'IMMovementType', 'R');
                docBinding.TempItem_ItemReadLink = binding.ProductionOrderItem_Nav['@odata.readLink'];
                docBinding.TempItem_OpenQuantity = Number(binding.ProductionOrderItem_Nav.OrderQuantity);
                docBinding.TempItem_ReceivedQuantity = Number(binding.ProductionOrderItem_Nav.ReceivedQuantity);
                libCom.setStateVariable(context, 'TempItem', docBinding);
                action = '/SAPAssetManager/Actions/Inventory/ProductionOrder/ProductionOrderItemUpdate.action';
            }

            context.getPageProxy().setActionBinding(docBinding);
            if (action) {
                return context.executeAction(action).then(() => {
                    return FinishDelete(context, binding);
                });
            }
            return FinishDelete(context, binding); //Not a type that requires update
        });
    });
}

/**
 * Remove document header if no more items and close screen if necessary
 * @param {IClientAPI} context 
 * @param {any} binding 
 * @returns 
 */
export function FinishDelete(context, binding) {
    if (!libCom.getStateVariable(context, 'TempInventoryMaterialDocumentDelete')) {
        let filter = `$filter=MaterialDocNumber eq '${binding.MaterialDocNumber}' and MaterialDocYear eq '${binding.MaterialDocYear}' and MatDocItem ne '${binding.MatDocItem}'`;
        return context.count('/SAPAssetManager/Services/AssetManager.service', 'MaterialDocItems', filter).then(function(count) {
            if (count === 0) { //No more items, so delete the header also
                binding.TempHeader_MatDocReadLink = "MaterialDocuments(MaterialDocNumber='" + binding.MaterialDocNumber + "',MaterialDocYear='" + binding.MaterialDocYear + "')";
                // put finally, because we trying to delete errors after deleting a doc, guarateet close of the page if there somehow would appear an error
                return context.executeAction('/SAPAssetManager/Actions/Inventory/MaterialDocument/MaterialDocumentDeleteDuringItemDelete.action').finally(() => {
                    const closePageCount = libCom.getStateVariable(context, 'ClosePageCount');
                    libCom.removeStateVariable(context, 'ClosePageCount');

                    const pageName = libCom.getPageName(context.evaluateTargetPathForAPI('#Page:-Previous'));
                    const currentPageName = libCom.getCurrentPageName(context);
                    
                    if (currentPageName === 'ItemDetailsPage') {
                        return Executor(context);
                    } else  if (pageName === 'ItemDetailsPage') {
                        return Executor(context, 1);
                    } else if (['MaterialDocumentDetails', 'MaterialDocumentDetailsIMPage', 'MaterialDocItemsListPage', 'MaterialDocReversalListPage'].some((name) => name === pageName)) {
                        return Executor(context, closePageCount);
                    } else {
                        return Executor(context);
                    }
                });
            } //Close item edit
            return Executor(context);
        });
    }
    return Promise.resolve(true);
}

/**
 * Execute the action required amount of times and close the page
 * @param {IClientAPI} context 
 * @param {Integer} closePageCount 
 * @returns 
 */
export async function Executor(context, closePageCount = 0) {
    const iMax = parseInt(closePageCount);
    if (!isNaN(iMax)) {
        for (let i = 0; i < iMax; i++) {
            await context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
        }
    }
    return ExecuteActionWithAutoSync(context, '/SAPAssetManager/Actions/CreateUpdateDelete/DeleteEntitySuccessMessage.action');
}
