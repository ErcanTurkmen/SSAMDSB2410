import libCommon from '../Common/Library/CommonLibrary';
import QueryBuilder from '../Common/Query/QueryBuilder';
import ModifyListViewSearchCriteria from '../LCNC/ModifyListViewSearchCriteria';

export default function ExpensesQueryOption(context) {
    let queryBuilder = new QueryBuilder();
    const activityType = libCommon.getExpenseActivityType(context);

    if (activityType) {
        queryBuilder.addFilter(`ActivityType eq '${activityType}'`);
    }

    if (context.binding && context.binding.OrderId) {
        queryBuilder.addFilter(`OrderID eq '${context.binding.OrderId}'`);

        if (context.binding.OperationNo) {//Inside an operation
            queryBuilder.addFilter(`Operation eq '${context.binding.OperationNo}'`);
        }
    }

    let searchString = context.searchString;
    if ((searchString)) {
        queryBuilder.addFilter(getSearchQuery(context, searchString.toLowerCase()));
    }

    return queryBuilder.build();
}

function getSearchQuery(context, searchString) {
    let searchQuery = '';

    if (searchString) {
        let searchByProperties = ['Description', 'OrderID', 'Operation'];
        ModifyListViewSearchCriteria(context, 'Confirmation', searchByProperties);
        
        searchQuery = libCommon.combineSearchQuery(searchString, searchByProperties);
    }

    return searchQuery;
}
