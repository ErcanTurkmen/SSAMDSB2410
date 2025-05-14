import CommonLibrary from '../Common/Library/CommonLibrary';
import ModifyListViewSearchCriteria from '../LCNC/ModifyListViewSearchCriteria';

export default function NotificationItemsListViewQueryOption(clientAPI) {
    let queryBuilder = clientAPI.dataQueryBuilder();

    queryBuilder.expand('Notification,Notification/NotifMobileStatus_Nav,Notification/NotifMobileStatus_Nav/OverallStatusCfg_Nav');
    queryBuilder.orderBy('ItemSortNumber asc');

    if (clientAPI.searchString) {
        queryBuilder.filter(getSearchQuery(clientAPI, clientAPI.searchString.toLowerCase()));
    }
    return queryBuilder;
}

function getSearchQuery(clientAPI, searchString) {
    let searchQuery = '';

    if (searchString) {
        let searchByProperties = ['ItemNumber', 'ItemText', 'ObjectPart', 'ObjectPartCodeGroup', 'DamageCode', 'CodeGroup'];
        ModifyListViewSearchCriteria(clientAPI, 'MyNotificationItem', searchByProperties);

        searchQuery = CommonLibrary.combineSearchQuery(searchString, searchByProperties);
    }

    return searchQuery;
}
