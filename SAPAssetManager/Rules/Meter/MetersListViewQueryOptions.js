import CommonLibrary from '../Common/Library/CommonLibrary';
import ModifyListViewSearchCriteria from '../LCNC/ModifyListViewSearchCriteria';

export default function MetersListViewQueryOptions(context) {
    let searchString = context.searchString;
    let qob = context.dataQueryBuilder();
    const odataType = context.binding['@odata.type'];

    if (
        odataType === '#sap_mobile.MyWorkOrderHeader' ||
        odataType === '#sap_mobile.MyWorkOrderOperation' ||
        odataType === '#sap_mobile.MyWorkOrderSubOperation'
    ) {
        qob.expand('Workorder_Nav/DisconnectActivity_Nav/DisconnectObject_Nav,Device_Nav/DeviceCategory_Nav/Material_Nav,DeviceLocation_Nav/Premise_Nav,Device_Nav/RegisterGroup_Nav/Division_Nav,Device_Nav/Equipment_Nav/ObjectStatus_Nav/SystemStatus_Nav,Device_Nav/GoodsMovement_Nav,DeviceLocation_Nav/FuncLocation_Nav/Address/AddressCommunication,ConnectionObject_Nav/FuncLocation_Nav/Address/AddressCommunication,DeviceLocation_Nav/Premise_Nav,Workorder_Nav/OrderMobileStatus_Nav,Workorder_Nav/OrderISULinks');
        if (!searchString)
            qob.filter('sap.entityexists(Device_Nav)');
        else
            qob.filter('sap.entityexists(Device_Nav) and (' + getSearchQuery(context, searchString, context.binding) + ')');
    } else {
        qob.expand('DeviceCategory_Nav,RegisterGroup_Nav/Division_Nav,Equipment_Nav/ObjectStatus_Nav/SystemStatus_Nav,ConnectionObject_Nav/FuncLocation_Nav/Address');
        if (searchString) {
            qob.filter(getSearchQuery(context, searchString, context.binding));
        }
    }
    return qob;
}

function getSearchQuery(context, searchString, binding = {}) {
    let searchQuery = '';
    const odataType = context.binding['@odata.type'];

    if (searchString) {
        let searchByProperties = [];

        let entityType = 'Device';
        if (
            odataType === '#sap_mobile.MyWorkOrderHeader' ||
            odataType === '#sap_mobile.MyWorkOrderOperation' ||
            odataType === '#sap_mobile.MyWorkOrderSubOperation'
        ) {
            entityType = 'OrderISULink';
        }

        ModifyListViewSearchCriteria(context, entityType, searchByProperties);
        
        let customSearchQueries = [];
        if (
            odataType === '#sap_mobile.MyWorkOrderHeader' ||
            odataType === '#sap_mobile.MyWorkOrderOperation' ||
            odataType === '#sap_mobile.MyWorkOrderSubOperation'
        ) {
            customSearchQueries.push('substringof(\'' + searchString.toLowerCase() + '\', tolower(Device_Nav/Device)) or substringof(\'' + searchString.toLowerCase() + '\', tolower(Device_Nav/DeviceCategory_Nav/Description))');
            customSearchQueries.push('substringof(\'' + searchString.toLowerCase() + '\', tolower(Device_Nav/RegisterGroup_Nav/Division)) or substringof(\'' + searchString.toLowerCase() + '\', tolower(Device_Nav/RegisterGroup_Nav/Division_Nav/Description))');
        } else if (binding['@odata.type'] === '#sap_mobile.ConnectionObject') {
            customSearchQueries.push('substringof(\'' + searchString.toLowerCase() + '\', tolower(Device)) or substringof(\'' + searchString.toLowerCase() + '\', tolower(DeviceCategory_Nav/Description))');
            customSearchQueries.push('substringof(\'' + searchString.toLowerCase() + '\', tolower(RegisterGroup_Nav/Division)) or substringof(\'' + searchString.toLowerCase() + '\', tolower(RegisterGroup_Nav/Division_Nav/Description))');
        }

        searchQuery = CommonLibrary.combineSearchQuery(searchString, searchByProperties, customSearchQueries);
    }

    return searchQuery;
}
