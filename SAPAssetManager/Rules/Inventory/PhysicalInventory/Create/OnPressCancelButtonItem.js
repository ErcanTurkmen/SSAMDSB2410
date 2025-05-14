import libInv from '../../Common/Library/InventoryLibrary';

/**
 * execute action for cancel of PI item create
 * @param {IClientAPI} context 
 * @returns execute the action
 */
export default function OnPressCancelButtonItem(context) {
    const hideSumPage = libInv.getHidePhysicalInventorySummaryPage(context);
    const action = hideSumPage ? '/SAPAssetManager/Actions/Inventory/PhysicalInventory/ConfirmCloseItemCreateNoSumPage.action' : '/SAPAssetManager/Actions/Inventory/PhysicalInventory/ConfirmCloseItemCreate.action';
    return context.executeAction(action);
}

