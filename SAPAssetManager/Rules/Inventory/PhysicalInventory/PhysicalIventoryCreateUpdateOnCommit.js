import commonLib from '../../Common/Library/CommonLibrary';

import Logger from '../../Log/Logger';
import postSerial from '../PhysicalInventory/Count/PhysicalInventoryDocItemSerialPost';
import validateData from '../Validation/ValidatePhysicalInventoryCount';
import PhysicalInventoryItemCreateNavWrapper from '../PhysicalInventory/PhysicalInventoryItemCreateNavWrapper';
import libInv from '../Common/Library/InventoryLibrary';

/** @param {IClientAPI} context  */
export default function PhysicalIventoryCreateUpdateOnCommit(context) {
    const onCreate = commonLib.IsOnCreate(context);
    const pageProxy = context.getPageProxy();

    /** @type {IControlContainerProxy} fcContainer */
    const fcContainer = pageProxy.getControl('FormCellContainer');
    return validateData(context).then(valid => {
        if (!valid || !onCreate) {
            return false; //Validation failed
        }
        SavePickerValuesToGlobalVars(fcContainer, context);

        let newPhysicalInventoryHeader;
        return pageProxy.executeAction('/SAPAssetManager/Actions/Inventory/PhysicalInventory/PhysicalInventoryCreate.action')
            .then(result => {
                newPhysicalInventoryHeader = JSON.parse(result.data);
            })
            .then(() => pageProxy.executeAction('/SAPAssetManager/Actions/Inventory/PhysicalInventory/PhysicalInventoryMyInventoryObjectCreate.action'))
            .then(() => pageProxy.executeAction('/SAPAssetManager/Actions/Inventory/PhysicalInventory/PhysicalInventoryItemCreateRelated.action'))
            .then(() => pageProxy.executeAction('/SAPAssetManager/Actions/Inventory/PhysicalInventory/PhysicalInventoryDocItemUpdateLinks.action'))
            .then(() => postSerial(context))
            .then(() => HandleSummaryPage(pageProxy, newPhysicalInventoryHeader))
            .catch((error) => {
                Logger.error('PhysicalInventory', `PhysicalInventory.create error: ${error}`);
            });
    });
}

/**
 * Handle summary page action depending on flag value
 * @param {IPageProxy} context
 * @returns executeAction result or true
 */
function HandleSummaryPage(context, newPhysicalInventoryHeader) {
    const navToList = commonLib.getStateVariable(context, 'PhysicalInventoryReturnToList');
    const isDonePressed = commonLib.getStateVariable(context, 'PIDoneButtonPressed');
    const hideSumPage = libInv.getHidePhysicalInventorySummaryPage(context);

    // reset var
    commonLib.removeStateVariable(context, 'PIDoneButtonPressed');

    if (navToList) { //Only return to items modal if we are adding from there
        if (hideSumPage) {
            if (isDonePressed) {
                const pageProxy = context.evaluateTargetPathForAPI('#Page:InboundOutboundListPage');
                return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action')  // closing the modal should happen only if we wont open one right after
                    .then(() => commonLib.navigateOnRead(pageProxy, '/SAPAssetManager/Actions/Inventory/PhysicalInventory/PhysicalInventoryDetailsNav.action', newPhysicalInventoryHeader['@odata.readLink'], '$expand=PhysicalInventoryDocItem_Nav'));
            }
            return PhysicalInventoryItemCreateNavWrapper(context);
        }
        return context.executeAction('/SAPAssetManager/Actions/Inventory/PhysicalInventory/PhysicalInventoryCreateListNav.action');
    }
    return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
}



function SavePickerValuesToGlobalVars(fcContainer, context) {
    const [plant, storageLocation, stockType, material] = ['PlantLstPkr', 'StorageLocationPicker', 'StockTypePicker', 'MatrialListPicker']
        .map(name => fcContainer.getControl(name).getValue()[0].ReturnValue);

    const [wbsElementControl, vendorControl] = ['WBSElementSimple', 'VendorListPicker'].map(name => fcContainer.getControl(name));
    if (wbsElementControl?.visible) {
        commonLib.setStateVariable(context, 'PhysicalInventoryItemWBSElementSimple', wbsElementControl.getValue());
    }
    if (vendorControl?.visible) {
        commonLib.setStateVariable(context, 'PhysicalInventoryItemVendorListPicker', vendorControl.getValue()[0].ReturnValue);
    }
    commonLib.setStateVariable(context, 'PhysicalInventoryItemPlant', plant);
    commonLib.setStateVariable(context, 'PhysicalInventoryItemStorageLocation', storageLocation);
    commonLib.setStateVariable(context, 'PhysicalInventoryItemStockType', stockType);
    commonLib.setStateVariable(context, 'PhysicalInventoryItemMaterial', material);
}
