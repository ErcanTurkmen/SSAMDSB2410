import ContainersFilterCaptionOpen from './ContainersFilterCaptionOpen';
import { CONTAINERS_OPEN_FILTER } from './ContainersListQueryOptions';
/**
* This function sets default filter for Containers List
* @param {IClientAPI} context
*/
export default function GetContainersPreSelectedFilter(context) {
    return [context.createFilterCriteria(context.filterTypeEnum.Filter, 'OpenContainers', [ContainersFilterCaptionOpen(context)],[CONTAINERS_OPEN_FILTER], true)];
}
