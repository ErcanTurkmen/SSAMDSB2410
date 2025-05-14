
export default function ServiceConfirmationItemCreateNav(context, binding) {
    let pageProxy = context.getPageProxy();
    let actionBinding = binding || pageProxy.getActionBinding();

    return context.read('/SAPAssetManager/Services/AssetManager.service', actionBinding['@odata.readLink'], [], '$expand=MobileStatus_Nav,S4ServiceOrder_Nav/TransHistories_Nav,ServiceProfile_Nav').then(result => {
        pageProxy.setActionBinding(result.getItem(0));
        return context.executeAction('/SAPAssetManager/Actions/ServiceConfirmations/Item/ServiceConfirmationItemCreateNav.action');
    });
}
