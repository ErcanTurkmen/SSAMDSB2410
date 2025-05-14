import CommonLibrary from '../../Common/Library/CommonLibrary';
import IsDiscardButtonVisibleForPIItem from '../PhysicalInventory/Count/IsDiscardButtonVisibleForPIItem';

/**
 * Show/Hide Discard button for ItemDetails page
 * @param {*} context 
 * @returns 
 */
export default function DiscardButtonVisible(context) {
    const entityName = (context.binding['@odata.type'] || context.binding.item['@odata.type']).split('.')[1];
    switch (entityName) {
        case 'PhysicalInventoryDocumentItem':
            return IsDiscardButtonVisibleForPIItem(context);
        case 'MaterialDocItem': {
            const currentReadLink = context.binding['@odata.type'] || context.binding.item['@odata.readLink'];
            return CommonLibrary.isCurrentReadLinkLocal(currentReadLink);
        }
        default:
            return false;
    }
}

