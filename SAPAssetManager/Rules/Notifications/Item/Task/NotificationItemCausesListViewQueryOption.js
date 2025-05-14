import CommonLibrary from '../../../Common/Library/CommonLibrary';
import ModifyListViewSearchCriteria from '../../../LCNC/ModifyListViewSearchCriteria';

export default function NotificationItemCausesListViewQueryOption(context) {
    let searchString = context.searchString;
    if (searchString) {
        let qob = context.dataQueryBuilder();
        qob.expand('Item/Notification').orderBy('CauseSortNumber');
        qob.filter( getSearchQuery(context, searchString.toLowerCase()));
        return qob;
    } else {
        return '$expand=Item/Notification&$orderby=CauseSortNumber asc';
    }
}

function getSearchQuery(context, searchString) {
    let searchQuery = '';

    if (searchString) {
        let searchByProperties = ['CauseSortNumber', 'CauseText', 'CauseCodeGroup', 'CauseCode'];
        ModifyListViewSearchCriteria(context, 'MyNotificationItemCause', searchByProperties);

        searchQuery = CommonLibrary.combineSearchQuery(searchString, searchByProperties);
    }

    return searchQuery;
}
