import CommonLibrary from '../../Common/Library/CommonLibrary';
import ModifyListViewSearchCriteria from '../../LCNC/ModifyListViewSearchCriteria';

export default function RoutesListQueryOptions(context) {
    let searchString = context.searchString;
    let filter = '$filter=sap.entityexists(StreetRouteConnObj_Nav) and sap.entityexists(PeriodicMeterReading_Nav)';
    
    if (searchString) {
        filter += ' and ' + getSearchQuery(context, searchString.toLowerCase());
    }

    return filter + '&$expand=StreetRouteConnObj_Nav';
}

function getSearchQuery(context, searchString) {
    let searchQuery = '';

    if (searchString) {
        let searchByProperties = ['Description', 'MeterReadingUnit'];
        ModifyListViewSearchCriteria(context, 'MeterReadingUnit', searchByProperties);

        searchQuery = CommonLibrary.combineSearchQuery(searchString, searchByProperties);
    }

    return searchQuery;
}
