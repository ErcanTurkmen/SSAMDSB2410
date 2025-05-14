import ModifyListViewSearchCriteria from '../../../LCNC/ModifyListViewSearchCriteria';
import CommonLibrary from '../../../Common/Library/CommonLibrary';
import { ContainerItemStatus } from '../../Common/FLLibrary';
import ValidationLibrary from '../../../Common/Library/ValidationLibrary';


export const HU_DEL_ITEMS_OPEN_FILTER = `ContainerItemStatus ne '${ContainerItemStatus.Received}'`;
export const HU_DEL_ITEMS_RECEIVED_FILTER = `ContainerItemStatus eq '${ContainerItemStatus.Received}'`;

export default function HUDelItemsOnLoadQuery(context) {

    let queryBuilder = context.dataQueryBuilder();
    queryBuilder.orderBy('Material');
    queryBuilder.expand('FldLogsHUDelItemStatus_Nav');
    const filterQuery = HUDelItemsListFilterAndSearchQuery(context, true, false);

    if (filterQuery) {
        queryBuilder.filter(filterQuery.replace('$filter=', ''));
    }
    return queryBuilder;

}

/**
 * 
 * @param {*} context 
 * @param {*} searchString 
 * @returns Search Query for Packages 
 */
function getHUDelItemsSearchQuery(context, searchString) {
    let searchQuery = '';

    if (searchString) {
        let searchByProperties = ['Material', 'ReferenceDocNumber','HandlingUnitID', 'VoyageNumber','ShippingPoint'];
        ModifyListViewSearchCriteria(context, 'FldLogsHuDelItems', searchByProperties);
        searchQuery = CommonLibrary.combineSearchQuery(searchString, searchByProperties);
    }

    return searchQuery;
}

/**
 * 
 * @param {*} context 
 * @param {*} addFilterAndSearch 
 * @returns Filter Query for Packages with/without filter and search
 */
export function HUDelItemsListFilterAndSearchQuery(context, addSearch = false, addFilter = false) {
    const material = context.getPageProxy().binding?.Material;
    const defaultFilterString = material ? `$filter=(Material eq '${material}')` : '';

    let filterOptions = [];
    if (addFilter) {
        filterOptions.push(getCurrentFilters(context));
    }
    if (addSearch && context.searchString) {
        filterOptions.push(getHUDelItemsSearchQuery(context, context.searchString.toLowerCase()));
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
       return `(${HU_DEL_ITEMS_OPEN_FILTER})`;     
    }
    return CommonLibrary.getFormattedQueryOptionFromFilter(context);
}
