import QueryBuilder from '../Common/Query/QueryBuilder';

export default function MeterSectionInstallUninstallQueryOptions() {
    let queryBuilder = new QueryBuilder();
    queryBuilder.addExpandStatement('Workorder_Nav/DisconnectActivity_Nav/DisconnectObject_Nav,Installation_Nav,Premise_Nav,Device_Nav/DeviceCategory_Nav/Material_Nav,Device_Nav/RegisterGroup_Nav/Division_Nav,Device_Nav/Equipment_Nav/ObjectStatus_Nav/SystemStatus_Nav,Device_Nav/GoodsMovement_Nav,Device_Nav/DeviceLocation_Nav/FuncLocation_Nav/Address/AddressCommunication,ConnectionObject_Nav/FuncLocation_Nav/Address/AddressCommunication,Device_Nav/DeviceLocation_Nav/Premise_Nav,Workorder_Nav/OrderMobileStatus_Nav,Workorder_Nav/OrderISULinks,Device_Nav/MeterReadings_Nav');
    queryBuilder.addFilter('sap.entityexists(Device_Nav)');
    return queryBuilder.build();
}
