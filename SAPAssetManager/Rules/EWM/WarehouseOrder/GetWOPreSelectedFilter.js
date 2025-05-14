import WOFilterCaptionOpen from './WOFilterCaptionOpen';
import { WO_OPEN_FILTER } from './WarehouseOrderListQueryOptions';
/**
* This function sets default filter for Voyage List
* @param {IClientAPI} context
*/
export default function GetWOPreSelectedFilter(context) {
    return [context.createFilterCriteria(context.filterTypeEnum.Filter, 'OpenGenericItems', [WOFilterCaptionOpen(context)],[WO_OPEN_FILTER], true)];
}

