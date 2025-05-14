import CommonLibrary from '../../../Common/Library/CommonLibrary';
import ModifyListViewSearchCriteria from '../../../LCNC/ModifyListViewSearchCriteria';

export default function PRTMaterialsListQueryOptions(context) {
    let filter = "$filter=(PRTCategory eq 'M')";
    let searchString = context.searchString;

    if (searchString) {
        filter += ' and ' + getSearchQuery(context, searchString.toLowerCase()); 
    }

    return filter;
}

function getSearchQuery(context, searchString) {
    let searchQuery = '';

    if (searchString) {
        let searchByProperties = ['Description', 'Material'];
        ModifyListViewSearchCriteria(context, 'MyWorkOrderTool', searchByProperties);

        searchQuery = CommonLibrary.combineSearchQuery(searchString, searchByProperties);
    }

    return searchQuery;
}
