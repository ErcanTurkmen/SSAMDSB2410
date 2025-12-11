import CommonLibrary from '../../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
import ModifyListViewSearchCriteria from '../../../../../SAPAssetManager/Rules/LCNC/ModifyListViewSearchCriteria';

export default function PRTMiscellaneousListQueryOptions(context) {
    let filter = "$filter=(PRTCategory eq 'A')";    // Upgrade to 2410 - Update the category to A for DSB "$filter=(PRTCategory eq 'O')";.
    let searchString = context.searchString;

    if (searchString) {
        filter += ' and ' + getSearchQuery(context, searchString.toLowerCase()); 
    }

    return filter;
}

function getSearchQuery(context, searchString) {
    let searchQuery = '';

    if (searchString) {
        let searchByProperties = ['Description', 'PRTTool'];
        ModifyListViewSearchCriteria(context, 'MyWorkOrderTool', searchByProperties);

        searchQuery = CommonLibrary.combineSearchQuery(searchString, searchByProperties);
    }

    return searchQuery;
}
