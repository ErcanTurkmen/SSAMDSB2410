import CommonLibrary from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';
import ModifyListViewSearchCriteria from '../../LCNC/ModifyListViewSearchCriteria';
import MeterSectionLibrary from '../../Meter/Common/MeterSectionLibrary';

export default function DisconnectObjectQueryOptions(context) {
    let searchString = context.searchString;
    let qob = context.dataQueryBuilder();
    const woBinding = MeterSectionLibrary.getWorkOrderBinding(context);
    let type = woBinding.OrderISULinks[0].ISUProcess;
    let activityType;
    if (type === 'DISCONNECT') {
        activityType = '01';
    } else if (type === 'RECONNECT') {
        activityType = '03';
    } else {
        activityType = '00';
    }
    
    qob.expand('DisconnectDoc_Nav,DisconnectActivity_Nav/WOHeader_Nav/OrderISULinks,Device_Nav/DeviceCategory_Nav/Material_Nav,Device_Nav/RegisterGroup_Nav/Division_Nav,Device_Nav/Equipment_Nav/ObjectStatus_Nav/SystemStatus_Nav,Device_Nav/GoodsMovement_Nav,Device_Nav/DeviceLocation_Nav');

    let filterString = `DisconnectActivity_Nav/OrderId eq '${woBinding.OrderId}' and DisconnectActivity_Nav/ActivityType eq '${activityType}'`;
    if (!libVal.evalIsEmpty(searchString)) {
        filterString += ' and ' + getSearchQuery(context, searchString.toLowerCase());
    }
    qob.filter(filterString);

    return qob;
}

function getSearchQuery(context, searchString) {
    let searchQuery = '';

    if (searchString) {
        let searchByProperties = [];
        ModifyListViewSearchCriteria(context, 'DisconnectionObject', searchByProperties);
        
        let customSearchQueries = [
            'substringof(\'' + searchString + '\', tolower(Device_Nav/Device)) or substringof(\'' + searchString + '\', tolower(Device_Nav/DeviceCategory_Nav/Description))',
            'substringof(\'' + searchString + '\', tolower(Device_Nav/RegisterGroup_Nav/Division)) or substringof(\'' + searchString + '\', tolower(Device_Nav/RegisterGroup_Nav/Division_Nav/Description))',
        ];

        searchQuery = CommonLibrary.combineSearchQuery(searchString, searchByProperties, customSearchQueries);
    }

    return searchQuery;
}
