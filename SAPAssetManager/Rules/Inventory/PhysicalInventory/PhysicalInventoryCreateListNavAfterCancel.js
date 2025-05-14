import libCom from '../../Common/Library/CommonLibrary';
import libInv from '../Common/Library/InventoryLibrary';

export default function PhysicalInventoryCreateListNavAfterCancel(context) {

    const navToList = libCom.getStateVariable(context, 'PhysicalInventoryReturnToList');
    const hideSumPage = libInv.getHidePhysicalInventorySummaryPage(context);

    return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
        return navToList && hideSumPage ? context.executeAction('/SAPAssetManager/Actions/Inventory/PhysicalInventory/PhysicalInventoryCreateListNav.action') : true;
    });
}
