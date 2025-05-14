import DetailsPageToolbarClass from '../../Common/DetailsPageToolbar/DetailsPageToolbarClass';
import S4ServiceLibrary from '../S4ServiceLibrary';
import { ServiceOrderDetailsPageName } from '../ServiceOrderDetailsPageToOpen';
import { NoteLibrary } from '../../Notes/NoteLibrary';

export default function ServiceOrderDetailsNav(context) {
    let pageProxy = context.getPageProxy();
    let actionBinding = pageProxy.getActionBinding();
    let expand = '$expand=MobileStatus_Nav/OverallStatusCfg_Nav,TransHistories_Nav/S4ServiceContract_Nav,RefObjects_Nav/Material_Nav,' +
        'Partners_Nav/BusinessPartner_Nav/Address_Nav/AddressGeocode_Nav/Geometry_Nav,' +
        'Partners_Nav/S4PartnerFunc_Nav,' +
        'RefObjects_Nav/Equipment_Nav/Address/AddressGeocode_Nav/Geometry_Nav,' +
        'RefObjects_Nav/FuncLoc_Nav/Address/AddressGeocode_Nav/Geometry_Nav,' +
        'S4ServiceErrorMessage_Nav';
    let queryOptions = '$select=*,MobileStatus_Nav/*&' + expand;

    return context.read('/SAPAssetManager/Services/AssetManager.service', actionBinding['@odata.readLink'], [], queryOptions).then(function(result) {
        pageProxy.setActionBinding(result.getItem(0));
        return generateToolbarItems(pageProxy).then(() => {
            NoteLibrary.didSetNoteTypeTransactionFlagForPage(context, ServiceOrderDetailsPageName(context));
            return context.executeAction('/SAPAssetManager/Actions/ServiceOrders/ServiceOrderDetailsNav.action');
        });
    });
}

function generateToolbarItems(pageProxy) {
    return S4ServiceLibrary.getAvailableStatusesServiceOrder(pageProxy, pageProxy.getActionBinding()).then(items => {
        return DetailsPageToolbarClass.getInstance().saveToolbarItems(pageProxy, items, ServiceOrderDetailsPageName(pageProxy)).then(() => {
            return Promise.resolve();
        });
    });
}
