import ModifyListViewSearchCriteria from '../../../LCNC/ModifyListViewSearchCriteria';
import CommonLibrary from '../../../Common/Library/CommonLibrary';
import { WarehouseTaskStatus } from '../../Common/EWMLibrary';
import ValidationLibrary from '../../../Common/Library/ValidationLibrary';

export const WAREHOUSE_TASKS_OPEN_FILTER = `WTStatus eq '${WarehouseTaskStatus.Open}' or WTStatus eq '${WarehouseTaskStatus.Waiting}'`;
export const WAREHOUSE_TASKS_CONFIRMED_FILTER = `WTStatus eq '${WarehouseTaskStatus.Confirmed}'`;

/**
 * 
 * @param {*} context 
 * @returns Filter Query for Warehouse Task
 */
export default function WarehouseTaskListQuery(context) {
    const queryBuilder = context.dataQueryBuilder();
    queryBuilder.orderBy('WarehouseTask');
    queryBuilder.filter(WarehouseTaskListFilterAndSearchQuery(context).replace('$filter=', ''));
    return queryBuilder;
}

/**
 * 
 * @param {*} context 
 * @param {*} searchString 
 * @returns Search Query for Warehouse Task
 */
export function getWarehouseTaskSearchQuery(context, searchString) {
    let searchQuery = '';
    if (searchString) {
        let searchByProperties = ['WarehouseTask', 'Product', 'SourceHU', 'DestinationHU', 'SourceBin', 'DestinationBin'];
        ModifyListViewSearchCriteria(context, 'WarehouseTask', searchByProperties);
        searchQuery = CommonLibrary.combineSearchQuery(searchString, searchByProperties);
    }
    return searchQuery;
}

/**
 * 
 * @param {*} context 
 * @param {*} addFilterAndSearch 
 * @returns Filter Query for Warehouse Task with/without filter and search
 */
export function WarehouseTaskListFilterAndSearchQuery(context, addFilterAndSearch = true) {
    const warehouseOrder = context.getPageProxy().binding?.WarehouseOrder;
    const defaultFilterString = warehouseOrder ? `$filter=(WarehouseOrder eq '${warehouseOrder}')` : '';
    const filterOptions = [];

    if (addFilterAndSearch) {
        filterOptions.push(getCurrentFilters(context));
        if (context.searchString) {
            filterOptions.push(getWarehouseTaskSearchQuery(context, context.searchString.toLowerCase()));
        }
    }
    return filterOptions.filter((filterOption => !!filterOption)).reduce((filterString, filterOption) => {
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
        return `(${WAREHOUSE_TASKS_OPEN_FILTER})`;
    }
    return CommonLibrary.getFormattedQueryOptionFromFilter(context);
}
