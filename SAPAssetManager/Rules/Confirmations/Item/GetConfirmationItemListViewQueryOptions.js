import S4ServiceLibrary from '../../ServiceOrders/S4ServiceLibrary';
import libCom from '../../Common/Library/CommonLibrary';
import ModifyListViewSearchCriteria from '../../LCNC/ModifyListViewSearchCriteria';

/**
* Query options for confirmation item list view screen
* @param {IClientAPI} context
*/
export default function GetConfirmationItemListViewQueryOptions(context) {
    let searchString = context.searchString;
    let filters = [];
    let expand = '$expand=S4ServiceConfirmation_Nav,MobileStatus_Nav/OverallStatusCfg_Nav/OverallStatusSeq_Nav';

    if (searchString) {
        filters.push(getSearchQuery(context, searchString));
    }

    if (libCom.isDefined(context.binding) && libCom.isDefined(context.binding.isInitialFilterNeeded)) {
        // getting filter values from state variable - slice(8) is need to remove '$filter='
        let extraFilter = S4ServiceLibrary.getConfirmationItemFilters(context).slice(8);
        if (extraFilter.trim()) {
            filters.push(extraFilter.trim());
        }
    }

    let query = expand;
    if (filters.length) {
        query += '&$filter=' + filters.join(' and ');
    }

    return query;
}

function getSearchQuery(context, searchString) {
    let searchQuery = '';

    if (searchString) {
        let searchByProperties = ['ItemDesc', 'ObjectID', 'ItemCategory'];
        ModifyListViewSearchCriteria(context, 'S4ServiceConfirmationItem', searchByProperties);

        searchQuery = libCom.combineSearchQuery(searchString, searchByProperties);
    }

    return searchQuery;
}
