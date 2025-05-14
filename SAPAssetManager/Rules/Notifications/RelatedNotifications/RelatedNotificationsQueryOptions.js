import libCom from '../../Common/Library/CommonLibrary';
import ModifyListViewSearchCriteria from '../../LCNC/ModifyListViewSearchCriteria';

export default function RelatedNotificationsQueryOptions(context) {
    let referenceType = libCom.getTargetPathValue(context, '#Page:-Previous/#ClientData/#Property:ReferenceType');
    let queryBuilder = context.dataQueryBuilder();
    queryBuilder.expand('HistoryLongText_Nav,HistoryPriority_Nav');
    queryBuilder.orderBy('Priority desc');

    let searchString = context.searchString;
    if (searchString) {
        queryBuilder.filter(getSearchQuery(context, searchString.toLowerCase()));
    }
    if (!libCom.isDefined(referenceType)) {
        return queryBuilder;
    } else if (referenceType === 'P') {
        queryBuilder.filter("ReferenceType eq 'P'");
        return queryBuilder;
    } else {
        queryBuilder.filter("ReferenceType eq 'H'");
        return queryBuilder;
    }
}

function getSearchQuery(context, searchString) {
    let searchQuery = '';

    if (searchString) {
        let searchByProperties = ['Description', 'NotificationNumber', 'NotificationType', 'HistoryPriority_Nav/PriorityDescription', 'HistoryLongText_Nav/TextString'];
        ModifyListViewSearchCriteria(context, 'NotificationHistory', searchByProperties);

        searchQuery = libCom.combineSearchQuery(searchString, searchByProperties);
    }

    return searchQuery;
}
