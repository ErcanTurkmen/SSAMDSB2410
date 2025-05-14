import CommonLibrary from '../../Common/Library/CommonLibrary';
import ModifyListViewSearchCriteria from '../../LCNC/ModifyListViewSearchCriteria';

export default function NotificationActivitiesListViewQueryOption(context) {
    let searchString = context.searchString;
    if (searchString) {
        let qob = context.dataQueryBuilder();
        qob.expand('Notification').orderBy('ActivitySortNumber');
        qob.filter(getSearchQuery(context, searchString.toLowerCase()));
        return qob;
    } else {
        return '$expand=Notification&$orderby=ActivitySortNumber asc';
    }
}

function getSearchQuery(context, searchString) {
    let searchQuery = '';

    if (searchString) {
        let searchByProperties = ['ActivitySortNumber', 'ActivityText', 'ActivityCodeGroup', 'ActivityCode'];
        ModifyListViewSearchCriteria(context, 'MyNotificationActivity', searchByProperties);

        searchQuery = CommonLibrary.combineSearchQuery(searchString, searchByProperties);
    }

    return searchQuery;
}
