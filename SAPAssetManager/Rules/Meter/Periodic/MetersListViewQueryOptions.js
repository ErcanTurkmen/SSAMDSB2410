import CommonLibrary from '../../Common/Library/CommonLibrary';
import ModifyListViewSearchCriteria from '../../LCNC/ModifyListViewSearchCriteria';

export default function MetersListViewQueryOptions(context) {
    let searchString = context.searchString;

    let qob = context.dataQueryBuilder();

    qob.expand('Device_Nav/DeviceCategory_Nav','Device_Nav/RegisterGroup_Nav/Division_Nav','Device_Nav/Equipment_Nav/ObjectStatus_Nav/SystemStatus_Nav','Device_Nav/ConnectionObject_Nav/FuncLocation_Nav/Address').orderBy('RouteIndex');
    let appFilter = 'sap.entityexists(Device_Nav/PeriodicMeterReading_Nav)';

    if (!searchString) {
        qob.filter(appFilter);
    } else {
        let search = getSearchQuery(context, searchString.toLowerCase());
        qob.filter().and(appFilter, search);
    }
    
    return qob;
}

function getSearchQuery(context, searchString) {
    let searchQuery = '';

    if (searchString) {
        let searchByProperties = ['Device_Nav/DeviceCategory_Nav/Description', 'Device_Nav/Device', 'Device_Nav/RegisterGroup_Nav/Division', 'Device_Nav/RegisterGroup_Nav/Division_Nav/Description'];

        ModifyListViewSearchCriteria(context, 'StreetRoute', searchByProperties);

        searchQuery = CommonLibrary.combineSearchQuery(searchString, searchByProperties);
    }

    return searchQuery;
}
