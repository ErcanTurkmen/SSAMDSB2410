import CommonLibrary from '../../../Common/Library/CommonLibrary';
import ModifyListViewSearchCriteria from '../../../LCNC/ModifyListViewSearchCriteria';

export default function NotificationItemTasksListViewQueryOption(context) {
    let searchString = context.searchString;
    if (searchString) {
        let qob = context.dataQueryBuilder();
        qob.expand('ItemTaskMobileStatus_Nav,Item/Notification/NotifMobileStatus_Nav').orderBy('TaskSortNumber');
        qob.filter(getSearchQuery(context, searchString.toLowerCase()));
        return qob;
    } else {
        return '$expand=ItemTaskMobileStatus_Nav,Item/Notification/NotifMobileStatus_Nav&$orderby=TaskSortNumber asc';
    }
}

function getSearchQuery(context, searchString) {
    let searchQuery = '';

    if (searchString) {
        let searchByProperties = ['TaskSortNumber', 'TaskText', 'TaskCodeGroup', 'TaskCode'];
        ModifyListViewSearchCriteria(context, 'MyNotificationItemTask', searchByProperties);

        searchQuery = CommonLibrary.combineSearchQuery(searchString, searchByProperties);
    }

    return searchQuery;
}
