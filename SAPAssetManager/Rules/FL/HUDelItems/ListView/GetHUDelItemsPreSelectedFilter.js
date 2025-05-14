import HUDelItemsFilterCaptionOpen from './HUDelItemsFilterCaptionOpen';
import { HU_DEL_ITEMS_OPEN_FILTER } from './HUDelItemsOnLoadQuery';
/**
* This function sets default filter for Delivery Items List
* @param {IClientAPI} context
*/
export default function GetDeliveryItemsPreSelectedFilter(context) {
    return [context.createFilterCriteria(context.filterTypeEnum.Filter, 'OpenHUDelItems', [HUDelItemsFilterCaptionOpen(context)],[HU_DEL_ITEMS_OPEN_FILTER], true)];
}
