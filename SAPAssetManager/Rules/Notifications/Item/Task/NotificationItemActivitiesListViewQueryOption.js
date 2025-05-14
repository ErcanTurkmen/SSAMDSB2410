import CommonLibrary from '../../../Common/Library/CommonLibrary';
import ModifyListViewSearchCriteria from '../../../LCNC/ModifyListViewSearchCriteria';

export default function NotificationItemActivitiesListViewQueryOption(context) {
    let searchString = context.searchString;
    if (searchString) {
        let qob = context.dataQueryBuilder();
        qob.expand('Item/Notification').orderBy('ActivitySortNumber');
        qob.filter(getSearchQuery(context, searchString.toLowerCase()));
        return qob;
    } else {
        return '$expand=Item/Notification&$orderby=ActivitySortNumber asc';
    }
}

function getSearchQuery(context, searchString) {
    let searchQuery = '';

    if (searchString) {
        let searchByProperties = ['ActivitySortNumber', 'ActivityText', 'ActivityCodeGroup', 'ActivityCode'];
        ModifyListViewSearchCriteria(context, 'MyNotificationItemActivity', searchByProperties);
        
        searchQuery = CommonLibrary.combineSearchQuery(searchString, searchByProperties);
    }

    return searchQuery;
}
