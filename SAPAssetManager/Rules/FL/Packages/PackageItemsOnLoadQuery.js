import ModifyListViewSearchCriteria from '../../LCNC/ModifyListViewSearchCriteria';
import CommonLibrary from '../../Common/Library/CommonLibrary';
import { ContainerItemStatus } from '../Common/FLLibrary';
import ValidationLibrary from '../../Common/Library/ValidationLibrary';


export const PACKAGE_ITEMS_OPEN_FILTER = `ContainerItemStatus ne '${ContainerItemStatus.Received}'`;
export const PACKAGE_ITEMS_RECEIVED_FILTER = `ContainerItemStatus eq '${ContainerItemStatus.Received}'`;

export default function PackageItemsOnLoadQuery(context) {

    let queryBuilder = context.dataQueryBuilder();
    queryBuilder.orderBy('Material');
    queryBuilder.expand('FldLogsContainerItemStatus_Nav');
    const filterQuery = PackageItemsListFilterAndSearchQuery(context, true, false);

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
function getPackagesSearchQuery(context, searchString) {
    let searchQuery = '';

    if (searchString) {
        let searchByProperties = ['Material', 'ShippingPoint', 'ReferenceDocNumber','HandlingUnitID','PackagingMaterial'];
        ModifyListViewSearchCriteria(context, 'FldLogsPackageItems', searchByProperties);
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
export function PackageItemsListFilterAndSearchQuery(context, addSearch = false, addFilter = false) {
    const containerID = context.getPageProxy().binding?.ContainerID;
    const defaultFilterString = containerID ? `$filter=(ContainerID eq '${containerID}')` : '';

    let filterOptions = [];
    if (addFilter) {
        filterOptions.push(getCurrentFilters(context));
    }
    if (addSearch && context.searchString) {
        filterOptions.push(getPackagesSearchQuery(context, context.searchString.toLowerCase()));
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
       return `(${PACKAGE_ITEMS_OPEN_FILTER})`;     
    }
    return CommonLibrary.getFormattedQueryOptionFromFilter(context);
}
