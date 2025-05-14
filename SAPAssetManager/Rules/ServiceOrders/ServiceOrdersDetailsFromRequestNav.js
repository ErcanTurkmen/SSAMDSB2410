import common from '../Common/Library/CommonLibrary';

export default function ServiceOrdersDetailsFromRequestNav(context) {
    let serviceOrder = context.getPageProxy().getActionBinding().S4ServiceOrder_Nav;
    return common.navigateOnRead(context.getPageProxy(), '/SAPAssetManager/Actions/ServiceOrders/ServiceOrderDetailsNav.action', serviceOrder['@odata.readLink'], '$expand=Priority_Nav');
}
