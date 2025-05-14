import ContainerItemsFilterCaptionOpen from './ContainerItemsFilterCaptionOpen';
import { CONTAINER_ITEMS_OPEN_FILTER } from './ContainerItemsListQueryOptions';
/**
* This function sets default filter for Containers List
* @param {IClientAPI} context
*/
export default function GetContainerItemsPreSelectedFilter(context) {
    return [context.createFilterCriteria(context.filterTypeEnum.Filter, 'OpenContainerItems', [ContainerItemsFilterCaptionOpen(context)],[CONTAINER_ITEMS_OPEN_FILTER], true)];
}
