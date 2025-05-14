import ModifyListViewSearchCriteria from '../../LCNC/ModifyListViewSearchCriteria';
import CommonLibrary from '../../Common/Library/CommonLibrary';

export const WO_OPEN_FILTER = "WOStatus eq '' or WOStatus eq 'D'";
export const WO_CONFIRMED_FILTER = "WOStatus eq 'C'";

export default function WarehouseOrderListQueryOptions(context) {

    let queryBuilder = context.dataQueryBuilder();
    queryBuilder.expand('WarehouseTask_Nav', 'WarehouseProcessType_Nav');
    if (context.searchString) {
        queryBuilder.filter(getSearchQuery(context, context.searchString.toLowerCase()));
    }
    return queryBuilder;


}

function getSearchQuery(context, searchString) {
    let searchQuery = '';

    if (searchString) {
        let searchByProperties = ['ActivityArea', 'Queue', 'WarehouseOrder', 'WOProcessType'];
        ModifyListViewSearchCriteria(context, 'WarehouseOrder', searchByProperties);

        searchQuery = CommonLibrary.combineSearchQuery(searchString, searchByProperties);
    }

    return searchQuery;
}
