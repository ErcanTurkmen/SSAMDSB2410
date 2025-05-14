import S4ServiceLibrary from '../../ServiceOrders/S4ServiceLibrary';
import libCom from '../../Common/Library/CommonLibrary';
import ModifyListViewSearchCriteria from '../../LCNC/ModifyListViewSearchCriteria';

/**
* Query options for confirmation list view screen
* @param {IClientAPI} context
*/
export default function GetConfirmationListViewQueryOptions(context) {
    let clientData = context.evaluateTargetPath('#Page:S4ConfirmationsListViewPage/#ClientData');
    
    const sorterType = 2;
    let tabFilters = context.filters ? context.filters.filter(filter => filter.type !== sorterType) : [];
    let filters = [];
    let captionFilters = [];
    if (tabFilters && tabFilters.length) {
        const items = tabFilters.map(val => val.filterItems.filter(subval => subval.includes('MobileStatus') || subval.includes('FinalConfirmation')))[tabFilters.length - 1];
        clientData.statusLstPickerValues = items;
        filters.push(items);
        captionFilters.push(items);
    } else {
        clientData.statusLstPickerValues = [];
    }

    let searchString = context.searchString;
    let expand = '$expand=ServiceConfirmationItems_Nav,MobileStatus_Nav/OverallStatusCfg_Nav/OverallStatusSeq_Nav,RefObjects_Nav/MyEquipment_Nav,RefObjects_Nav/MyFunctionalLocation_Nav,RefObjects_Nav/Material_Nav,Partners_Nav,OrderTransHistory_Nav,Document';

    if (searchString) {
        filters.push(getSearchQuery(context, searchString.toLowerCase()));
    }

    if (libCom.isDefined(context.binding) && libCom.isDefined(context.binding.isInitialFilterNeeded)) {
        // getting filter values from state variable - slice(8) is need to remove '$filter='
        let extraFilter = S4ServiceLibrary.getConfirmationFilters(context).slice(8);
        if (extraFilter.trim()) {
            filters.push(extraFilter.trim());
            captionFilters.push(extraFilter.trim());
        }
    }

    let query = expand;
    if (filters.length) {
        query += '&$filter=' + filters.join(' and ');
    }

    setCaption(context, captionFilters.join(' and '));

    return query;
}

function setCaption(context, queryOptions) {
    let filters = S4ServiceLibrary.getCaptionQuery(context, 'S4ConfirmationsListViewPage');
    if (filters) {
        if (queryOptions) {
            queryOptions += ' and (' + filters + ')';
        } else {
            queryOptions = filters;
        }
    }

    if (queryOptions) {
        queryOptions = '$filter=' + queryOptions;
    }

    return S4ServiceLibrary.getListCountCaption(
        context,
        'S4ServiceConfirmations',
        '',
        queryOptions,
        'confirmations_count',
        'confirmations_count_x_x',
    ).then(caption => {
        return context.getPageProxy().setCaption(caption);
    });
}

function getSearchQuery(context, searchString) {
    let searchQuery = '';

    if (searchString) {
        let searchByProperties = ['Description', 'ObjectID'];
        ModifyListViewSearchCriteria(context, 'S4ServiceConfirmation', searchByProperties);

        searchQuery = libCom.combineSearchQuery(searchString, searchByProperties);
    }

    return searchQuery;
}
