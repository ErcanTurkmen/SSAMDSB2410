import libCommon from '../Common/Library/CommonLibrary';
import isInventoryClerk from '../SideDrawer/EnableInventoryClerk';
import enableAttachment from '../UserAuthorizations/Attachments/EnableAttachment';
import { InventoryOrderTypes } from '../Inventory/Common/Library/InventoryLibrary';

/**
* Show/hide Documents section depending on CA_ATTACHMENT feature
*/
export default function DocumentsIsVisible(context) {
    if (isInventoryClerk(context)) {
        let type = libCommon.getStateVariable(context, 'IMObjectType');
        return type !== InventoryOrderTypes.REV && type !== InventoryOrderTypes.IB && type !== InventoryOrderTypes.OB;
    } else {
        return enableAttachment(context);
    }
}
