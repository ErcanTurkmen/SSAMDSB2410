import CommonLibrary from '../../Common/Library/CommonLibrary';
import S4ServiceLibrary from '../../ServiceOrders/S4ServiceLibrary';

export default function CreateServiceItemNav(context) {
    CommonLibrary.setOnCreateUpdateFlag(context, 'CREATE');
    S4ServiceLibrary.setServiceItemBasicMode(context);
    let binding = context.binding;
    if (!binding && context.getPageProxy().getActionBinding()) {
        binding = context.getPageProxy().getActionBinding();
    }
    context.getPageProxy().setActionBinding(binding);
    return context.executeAction('/SAPAssetManager/Actions/ServiceItems/ServiceItemCreateChangeset.action');
}
