import CommonLibrary from '../../Common/Library/CommonLibrary';
import ModifyListViewSearchCriteria from '../../LCNC/ModifyListViewSearchCriteria';

export default function PRTListQueryOptions(context) {
    let filter =  "$filter=(PRTCategory eq 'E')";

    let searchString = context.searchString;
    if (searchString) {
        filter += ' and ' + getSearchQuery(context, searchString.toLowerCase());
    }

    return filter + '&$expand=PRTEquipment&$orderby=ItemNum,ItemCounter';
}

function getSearchQuery(context, searchString) {
    let searchQuery = '';

    if (searchString) {
        let searchByProperties = ['Description', 'Equipment', 'TechnicalID'];
        ModifyListViewSearchCriteria(context, 'MyWorkOrderTool', searchByProperties);

        searchQuery = CommonLibrary.combineSearchQuery(searchString, searchByProperties);
    }

    return searchQuery;
}
