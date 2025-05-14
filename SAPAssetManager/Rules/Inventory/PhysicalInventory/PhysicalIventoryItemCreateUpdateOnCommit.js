import libCom from '../../Common/Library/CommonLibrary';
import libInv from '../Common/Library/InventoryLibrary';
import Logger from '../../Log/Logger';
import postSerial from '../PhysicalInventory/Count/PhysicalInventoryDocItemSerialPost';
import validateData from '../Validation/ValidatePhysicalInventoryCount';
import PhysicalInventoryItemCreateNavWrapper from '../PhysicalInventory/PhysicalInventoryItemCreateNavWrapper';
import PhysicalInventoryDocumentReadLink from '../PhysicalInventory/PhysicalInventoryDocumentReadLink';

export default function(context) {
    const onCreate = libCom.IsOnCreate(context);
    const pageProxy = context.getPageProxy();

    return validateData(context).then(valid => {
        if (!valid || !onCreate) {
            return false; //Validation failed
        }
        libCom.setStateVariable(context, 'RedrawPIItemsCounted', true);
        return pageProxy.executeAction('/SAPAssetManager/Actions/Inventory/PhysicalInventory/PhysicalInventoryItemCreateRelated.action')
            .then(() => pageProxy.executeAction('/SAPAssetManager/Actions/Inventory/PhysicalInventory/PhysicalInventoryDocItemUpdateLinks.action'))
            .then(() => postSerial(context))
            .then(() => HandleSummaryPage(pageProxy))
            .catch((error) => {
                Logger.error('PhysicalIventory', `PhysicalIventoryItem.create error: ${error}`);
            });
    });
}

/**
 * Handle summary page action depending on flag value
 * @param {IPageProxy} context
 * @returns executeAction result or true
 */
function HandleSummaryPage(context) {
    const navToList = libCom.getStateVariable(context, 'PhysicalInventoryReturnToList');
    const isDonePressed = libCom.getStateVariable(context, 'PIDoneButtonPressed');
    const hideSumPage = libInv.getHidePhysicalInventorySummaryPage(context);

    // reset var
    libCom.removeStateVariable(context, 'PIDoneButtonPressed');

    if (hideSumPage) {
        if (isDonePressed) {
            // get parent page
            const parentPage = libCom.getCurrentPageName(context);
            return context.executeAction('/SAPAssetManager/Actions/Inventory/PhysicalInventory/PhysicalInventoryCloseModal.action')
                .then(() => {
                    if (parentPage === 'PhysicalInventoryItemsListPage') {
                        return '';
                    }
                    const pageProxy = context.evaluateTargetPathForAPI('#Page:InboundOutboundListPage');
                    return PhysicalInventoryDocumentReadLink(context)
                        .then(readLink => libCom.navigateOnRead(pageProxy, '/SAPAssetManager/Actions/Inventory/PhysicalInventory/PhysicalInventoryDetailsNav.action', readLink, '$expand=PhysicalInventoryDocItem_Nav'));
                });
        } else {
            return PhysicalInventoryItemCreateNavWrapper(context);
        }
    } else if (navToList) { //Only return to items modal if we are adding from there
        return context.executeAction('/SAPAssetManager/Actions/Inventory/PhysicalInventory/PhysicalInventoryCreateListNav.action');
    }
    return context.executeAction('/SAPAssetManager/Actions/Inventory/PhysicalInventory/PhysicalInventoryCloseModal.action');
}
