import CommonLibrary from '../Common/Library/CommonLibrary';
import ModifyListViewSearchCriteria from '../LCNC/ModifyListViewSearchCriteria';
import { WorkOrderLibrary as LibWo } from '../WorkOrders/WorkOrderLibrary';

export default function RemindersQueryOptions(context) {
    let query = LibWo.getRemindersQueryOptionsFilter();

    let searchString = context.searchString;
    if (searchString) {
        query = query.replace('$filter=', '');
        query = '$filter=' + getSearchQuery(context, searchString.toLowerCase()) + ' and ' + query;
    }

    return query;
}

function getSearchQuery(context, searchString) {
    let searchQuery = '';

    if (searchString) {
        let searchByProperties = ['PreferenceName', 'PreferenceValue'];
        ModifyListViewSearchCriteria(context, 'UserPreference', searchByProperties);

        searchQuery = CommonLibrary.combineSearchQuery(searchString, searchByProperties);
    }

    return searchQuery;
}
