import CommonLibrary from '../../Common/Library/CommonLibrary';
import ShowAccessoryButtonIcon from '../MaterialDocument/ShowAccessoryButtonIcon';
import MaterialHeaderButtonVisible from './MaterialHeaderButtonVisible';

/** @param {{binding: import('./ItemsData').ItemDetailsBinding}} context  */
export default function MaterialDocItemEditVisible(context) {
    const item = context.getPageProxy().getClientData().item || context.binding.item;
    if (item['@odata.type'].includes('PurchaseRequisitionHeader') || item['@odata.type'].includes('PurchaseRequisitionItem')) {
        const isLocal = CommonLibrary.isCurrentReadLinkLocal(context.binding.item['@odata.readLink']);
        if (!isLocal) {
            return false;
        }
    }
    if (!item['@odata.type'].includes('MaterialDocItem')) {
        return true;
    }
    return ShowAccessoryButtonIcon(context).then((icon) => {
        return icon && icon.length ? MaterialHeaderButtonVisible(context, true) : false;
    });
}
