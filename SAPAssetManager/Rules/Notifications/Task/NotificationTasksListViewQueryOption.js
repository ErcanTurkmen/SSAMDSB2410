import CommonLibrary from '../../Common/Library/CommonLibrary';
import ModifyListViewSearchCriteria from '../../LCNC/ModifyListViewSearchCriteria';

export default function NotificationTasksListViewQueryOption(context) {
    let searchString = context.searchString;
    if (searchString) {
        let qob = context.dataQueryBuilder();
        qob.expand('Notification/NotifMobileStatus_Nav,TaskMobileStatus_Nav').orderBy('TaskSortNumber');
        qob.filter( getSearchQuery(context, searchString.toLowerCase()));
        return qob;
    } else {
        return '$expand=Notification/NotifMobileStatus_Nav,TaskMobileStatus_Nav&$orderby=TaskSortNumber asc';
    }
}

function getSearchQuery(context, searchString) {
    let searchQuery = '';

    if (searchString) {
        let searchByProperties = ['TaskSortNumber', 'TaskText', 'TaskCodeGroup'];
        ModifyListViewSearchCriteria(context, 'MyNotificationTask', searchByProperties);

        searchQuery = CommonLibrary.combineSearchQuery(searchString, searchByProperties);
    }

    return searchQuery;
}
