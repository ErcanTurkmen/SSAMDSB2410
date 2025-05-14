import ModifyListViewSearchCriteria from '../../../LCNC/ModifyListViewSearchCriteria';
import CommonLibrary from '../../../Common/Library/CommonLibrary';
import { ContainerStatus } from '../../Common/FLLibrary';
import ValidationLibrary from '../../../Common/Library/ValidationLibrary';

export const CONTAINERS_OPEN_FILTER = `ContainerStatus ne '${ContainerStatus.Received}'`;
export const CONTAINERS_RECEIVED_FILTER = `ContainerStatus eq '${ContainerStatus.Received}'`;

/**
 * 
 * @param {*} context 
 * @returns Filter Query for Containers
 */
export default function ContainersListQueryOptions(context) {
    const queryBuilder = context.dataQueryBuilder();
    queryBuilder.orderBy('ContainerID');
    queryBuilder.expand('FldLogsContainerStatus_Nav', 'FldLogsContainerItem_Nav', 'FldLogsPackage_Nav');
    const filterQuery = ContainersListFilterAndSearchQuery(context, true, false);
    if (filterQuery) {
        queryBuilder.filter(filterQuery.replace('$filter=', ''));
    }
    return queryBuilder;
}

/**
 * 
 * @param {*} context 
 * @param {*} searchString 
 * @returns Search Query for Containers
 */
export function getContainersSearchQuery(context, searchString) {
    let searchQuery = '';
    if (searchString) {
        let searchByProperties = ['ContainerID', 'VoyageNumber', 'ShippingPoint', 'FldLogsContainerStatus_Nav/FldContainerStatusDescription'];
        ModifyListViewSearchCriteria(context, 'FldLogsContainers', searchByProperties);
        searchQuery = CommonLibrary.combineSearchQuery(searchString, searchByProperties);
    }
    return searchQuery;
}

/**
 * 
 * @param {*} context 
 * @param {*} addFilterAndSearch 
 * @returns Filter Query for Containers with/without filter and search
 */
export function ContainersListFilterAndSearchQuery(context, addSearch = false, addFilter = false) {
    const voyageNumber = context.getPageProxy().binding?.VoyageNumber;
    const defaultFilterString = voyageNumber ? `$filter=(VoyageNumber eq '${voyageNumber}')` : '';

    let filterOptions = [];
    if (addFilter) {
        filterOptions.push(getCurrentFilters(context));
    }
    if (addSearch && context.searchString) {
        filterOptions.push(getContainersSearchQuery(context, context.searchString.toLowerCase()));
    }
    return filterOptions.filter((filterOption => !!filterOption)).reduce(function(filterString, filterOption) {
        return CommonLibrary.attachFilterToQueryOptionsString(filterString, filterOption);
      }, defaultFilterString);
}

/**
 * 
 * @param {*} context 
 * @returns Currently set filters. In case of page onLoaded event, we should return the preselected filter.
 */
function getCurrentFilters(context) {
    if (ValidationLibrary.evalIsEmpty(context.getPageProxy().getControls())) {
       return `(${CONTAINERS_OPEN_FILTER})`;     
    }
    return CommonLibrary.getFormattedQueryOptionFromFilter(context);
}
