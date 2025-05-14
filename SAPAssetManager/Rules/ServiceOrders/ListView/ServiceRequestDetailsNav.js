import DetailsPageToolbarClass from '../../Common/DetailsPageToolbar/DetailsPageToolbarClass';
import S4ServiceLibrary from '../S4ServiceLibrary';

export default function ServiceRequestDetailsNav(context) {
    let pageProxy = context.getPageProxy();
    let actionBinding = pageProxy.getActionBinding();
    let queryOptions = '$select=*,MobileStatus_Nav/*&$expand=MobileStatus_Nav/OverallStatusCfg_Nav,RefObj_Nav/MyEquipment_Nav,RefObj_Nav/MyFunctionalLocation_Nav';
       
    return context.read('/SAPAssetManager/Services/AssetManager.service', actionBinding['@odata.readLink'], [], queryOptions).then(function(result) {
        pageProxy.setActionBinding(result.getItem(0));
        return generateToolbarItems(pageProxy).then(() => {
            return context.executeAction('/SAPAssetManager/Actions/ServiceOrders/ServiceRequestsDetailsNav.action');
        });
    });
}

function generateToolbarItems(pageProxy) {
    return S4ServiceLibrary.getAvailableStatusesServiceRequest(pageProxy, pageProxy.getActionBinding()).then(items => {
        return DetailsPageToolbarClass.getInstance().saveToolbarItems(pageProxy, items, 'ServiceRequestDetailsPage').then(() => {
            return Promise.resolve();
        });
    });
}
