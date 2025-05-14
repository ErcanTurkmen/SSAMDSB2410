import CommonLibrary from '../../Common/Library/CommonLibrary';
import S4ServiceLibrary from '../../ServiceOrders/S4ServiceLibrary';

export default function EditServiceItemNav(context) {
    CommonLibrary.setOnCreateUpdateFlag(context, 'UPDATE');
    S4ServiceLibrary.setServiceItemBasicMode(context);
    return context.executeAction('/SAPAssetManager/Actions/ServiceItems/ServiceItemCreateUpdateNav.action');
}
