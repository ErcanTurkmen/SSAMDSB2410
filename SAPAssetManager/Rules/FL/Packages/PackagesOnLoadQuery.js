import ModifyListViewSearchCriteria from '../../LCNC/ModifyListViewSearchCriteria';
import CommonLibrary from '../../Common/Library/CommonLibrary';
import { ContainerStatus } from '../Common/FLLibrary';
import ValidationLibrary from '../../Common/Library/ValidationLibrary';


export const PACKAGES_OPEN_FILTER = `ContainerStatus ne '${ContainerStatus.Received}'`;
export const PACKAGES_RECEIVED_FILTER = `ContainerStatus eq '${ContainerStatus.Received}'`;

export default function PackagesOnLoadQuery(context) {

    let queryBuilder = context.dataQueryBuilder();
    queryBuilder.orderBy('ContainerID');
    queryBuilder.expand('FldLogsPackageItem_Nav', 'FldLogsContainerStatus_Nav');
    const filterQuery = PackagesListFilterAndSearchQuery(context, true, false);

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
        let searchByProperties = ['ContainerID', 'SupplierNo', 'ShippingPoint', 'FldLogsContainerStatus_Nav/FldContainerStatusDescription'];
        ModifyListViewSearchCriteria(context, 'FldLogsPackages', searchByProperties);
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
export function PackagesListFilterAndSearchQuery(context, addSearch = false, addFilter = false) {
            const containerID = context.getPageProxy().binding?.ContainerID;
            const voyageNumber = context.getPageProxy().binding?.VoyageNumber;
        
            let defaultFilterString = '';
        
            if (containerID) {
                defaultFilterString = `$filter=(ParentCtnID eq '${containerID}')`;
            } else if (voyageNumber) {
                // Exclude records where ParentCtnID is not null or empty
                defaultFilterString = `$filter=(VoyageNumber eq '${voyageNumber}' and (ParentCtnID eq null or ParentCtnID eq ''))`;
            }

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
       return `(${PACKAGES_OPEN_FILTER})`;     
    }
    return CommonLibrary.getFormattedQueryOptionFromFilter(context);
}
