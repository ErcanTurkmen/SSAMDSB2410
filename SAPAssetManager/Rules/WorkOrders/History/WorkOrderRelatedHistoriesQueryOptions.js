import CommonLibrary from '../../Common/Library/CommonLibrary';
import ModifyListViewSearchCriteria from '../../LCNC/ModifyListViewSearchCriteria';

export default function WorkOrderRelatedHistoriesQueryOptions(context) {
    let filter = "$filter=ReferenceType eq 'H'";

    let searchString = context.searchString;
    if (searchString) {
        filter += ' and ' +getSearchQuery(context, searchString.toLowerCase());
    }

    return filter + '&$expand=HistoryLongText,HistoryPriority&$top=3&$orderby=Priority,OrderId desc';
}

function getSearchQuery(context, searchString) {
    let searchQuery = '';

    if (searchString) {
        let searchByProperties = ['OrderId', 'HistoryPriority/PriorityDescription', 'OrderDescription', 'OrderType', 'HistoryLongText'];
        ModifyListViewSearchCriteria(context, 'WorkOrderHistory', searchByProperties);

        searchQuery = CommonLibrary.combineSearchQuery(searchString, searchByProperties);
    }

    return searchQuery;
}
