import CommonLibrary from '../Common/Library/CommonLibrary';
import ModifyListViewSearchCriteria from '../LCNC/ModifyListViewSearchCriteria';

export default function S4RelatedHistoriesRecentQueryOptions(context) {
    let searchString = context.searchString;
    let filter = "$filter=ReferenceType eq 'H'";
    if (searchString !== '') {
        filter += ' and ' + getSearchQuery(context, searchString.toLowerCase());
    }

    return filter + '&$expand=LongText_Nav&$orderby=Priority,ObjectID desc';
}

function getSearchQuery(context, searchString) {
    let searchQuery = '';

    if (searchString) {
        let searchByProperties = ['ObjectID', 'Description'];

        let entityName = 'S4ServiceOrderRefObjHistory';
        const pageBinding = context.binding || {};
        switch (pageBinding.RelatedEntity) {
            case 'S4ServiceRequest':
                entityName = 'S4ServiceRequestRefObjHistory';
                break;
            case 'S4ServiceConfirmation':
                entityName = 'S4ServiceConfirmationRefObjHistory';
                break;
            default:
               break;
        }
        ModifyListViewSearchCriteria(context, entityName, searchByProperties);

        searchQuery = CommonLibrary.combineSearchQuery(searchString, searchByProperties);
    }

    return searchQuery;
}
