import ModifyListViewSearchCriteria from '../../LCNC/ModifyListViewSearchCriteria';
import CommonLibrary from '../../Common/Library/CommonLibrary';
import { ContainerItemStatus } from '../Common/FLLibrary';
import ValidationLibrary from '../../Common/Library/ValidationLibrary';

export const CONTAINER_ITEMS_OPEN_FILTER = `ContainerItemStatus ne '${ContainerItemStatus.Received}'`;
export const CONTAINER_ITEMS_RECEIVED_FILTER = `ContainerItemStatus eq '${ContainerItemStatus.Received}'`;

/**
 * 
 * @param {*} context 
 * @returns Filter Query for Container Items
 */
export default function ContainerItemsListQueryOptions(context) {
    const queryBuilder = context.dataQueryBuilder();
    queryBuilder.expand('FldLogsContainerItemStatus_Nav');
    const filterQuery = ContainerItemsListFilterAndSearchQuery(context, true, false);
    if (filterQuery) {
        queryBuilder.filter(filterQuery.replace('$filter=', ''));
    }
    return queryBuilder;
}

/**
 * 
 * @param {*} context 
 * @param {*} searchString 
 * @returns Search Query for Container Items
 */
export function getContainerItemsSearchQuery(context, searchString) {
    let searchQuery = '';
    if (searchString) {
        let searchByProperties = ['Material', 'VoyageNumber', 'HandlingUnitID', 'ReferenceDocNumber', 'SourceStage'];
        ModifyListViewSearchCriteria(context, 'FldLogsContainerItems', searchByProperties);
        searchQuery = CommonLibrary.combineSearchQuery(searchString, searchByProperties);
    }
    return searchQuery;
}

/**
 * 
 * @param {*} context 
 * @param {*} addFilterAndSearch 
 * @returns Filter Query for Container Items with/without filter and search
 */
export function ContainerItemsListFilterAndSearchQuery(context, addSearch = false, addFilter = false) {
    const containerID = context.getPageProxy().binding?.ContainerID;
    const defaultFilterString = containerID ? `$filter=(ContainerID eq '${containerID}')` : '';
    
    let filterOptions = [];
    if (addFilter) {
        filterOptions.push(getCurrentFilters(context));
    }
    if (addSearch && context.searchString) {
        filterOptions.push(getContainerItemsSearchQuery(context, context.searchString.toLowerCase()));
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
       return `(${CONTAINER_ITEMS_OPEN_FILTER})`;     
    }
    return CommonLibrary.getFormattedQueryOptionFromFilter(context);
}
