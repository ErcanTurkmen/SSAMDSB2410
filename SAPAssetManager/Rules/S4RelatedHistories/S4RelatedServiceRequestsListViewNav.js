
export default function S4RelatedServiceRequestsListViewNav(context) {
    let binding = context.getBindingObject();
    binding.RelatedEntity = 'S4ServiceRequest';
    context.getPageProxy().setActionBinding(binding);
    return context.executeAction('/SAPAssetManager/Actions/S4RelatedHistories/S4RelatedHistoriesListViewNav.action');
}
