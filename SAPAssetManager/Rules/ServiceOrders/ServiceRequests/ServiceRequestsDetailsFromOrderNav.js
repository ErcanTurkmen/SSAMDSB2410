import common from '../../Common/Library/CommonLibrary';

export default function ServiceRequestsDetailsFromOrderNav(context) {
    let serviceRequest = context.getPageProxy().getActionBinding().S4ServiceRequest_Nav;
    return common.navigateOnRead(context.getPageProxy(), '/SAPAssetManager/Actions/ServiceOrders/ServiceRequestsDetailsNav.action', serviceRequest['@odata.readLink'], '$expand=Priority_Nav');
}
