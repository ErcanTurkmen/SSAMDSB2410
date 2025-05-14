import ModifyListViewSearchCriteria from '../../LCNC/ModifyListViewSearchCriteria';
import CommonLibrary from '../../Common/Library/CommonLibrary';
import { VoyageStatus } from '../Common/FLLibrary';
import ValidationLibrary from '../../Common/Library/ValidationLibrary';


export const VOYAGES_INTRANSIT_FILTER = `VoyageStatusCode eq '${VoyageStatus.InTransit}'`;
export const VOYAGES_ARRIVED_COMPLETED_FILTER = `VoyageStatusCode eq '${VoyageStatus.Arrived}' or VoyageStatusCode eq '${VoyageStatus.Completed}'`;

export default function VoyagesOnLoadQuery(context) {

    let queryBuilder = context.dataQueryBuilder();
    queryBuilder.expand('FldLogsVoyageStatus_Nav', 'FldLogsContainer_Nav', 'FldLogsPackage_Nav', 'FldLogsVoyageType_Nav');
    queryBuilder.orderBy('VoyageNumber');
    const filterQuery = VoyagesListFilterAndSearchQuery(context, true, false);
    if (filterQuery) {
        queryBuilder.filter(filterQuery.replace('$filter=', ''));
    }
    return queryBuilder;
}

/**
 * 
 * @param {*} context 
 * @param {*} searchString 
 * @returns Search Query for Voyages
 */
export function getVoyagesSearchQuery(context, searchString) {
    let searchQuery = '';

    if (searchString) {
        let searchByProperties = ['VoyageNumber', 'SourceStage', 'Supplier', 'FldLogsVoyageStatus_Nav/Description', 'FldLogsVoyageType_Nav/Description'];
        ModifyListViewSearchCriteria(context, 'FldLogsVoyages', searchByProperties);
        searchQuery = CommonLibrary.combineSearchQuery(searchString, searchByProperties);
    }

    return searchQuery;
}

/**
 * 
 * @param {*} context 
 * @param {*} addFilterAndSearch 
 * @returns Filter Query for Voyages with/without filter and search
 */
export function VoyagesListFilterAndSearchQuery(context, addSearch = false, addFilter = false) {
    let filterOptions = [];
    if (addFilter) {
        filterOptions.push(getCurrentFilters(context));
    }
    if (addSearch && context.searchString) {
        filterOptions.push(getVoyagesSearchQuery(context, context.searchString.toLowerCase()));
    }
    return filterOptions.filter((filterOption => !!filterOption)).reduce(function(filterString, filterOption) {
        return CommonLibrary.attachFilterToQueryOptionsString(filterString, filterOption);
      }, '');
}

/**
 * 
 * @param {*} context 
 * @returns Currently set filters. In case of page onLoaded event, we should return the preselected filter.
 */
function getCurrentFilters(context) {
    if (ValidationLibrary.evalIsEmpty(context.getPageProxy().getControls())) {
       return `(${VOYAGES_INTRANSIT_FILTER})`;     
    }
    return CommonLibrary.getFormattedQueryOptionFromFilter(context);
}
