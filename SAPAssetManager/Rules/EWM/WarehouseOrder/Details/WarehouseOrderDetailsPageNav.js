import comLib from '../../../Common/Library/CommonLibrary';

export default function WarehouseOrderDetailsPageNav(clientAPI) {
    const pageProxy = clientAPI.getPageProxy();
    return comLib.navigateOnRead(pageProxy, '/SAPAssetManager/Actions/EWM/WarehouseOrders/WarehouseOrderDetailsPageNav.action', pageProxy.getActionBinding()['@odata.readLink'], '$expand=WarehouseTask_Nav, WarehouseProcessType_Nav, WarehouseOrderQueue_Nav');
}
