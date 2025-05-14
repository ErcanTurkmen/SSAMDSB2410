
export default function S4RelatedServiceOrdersListViewNav(context) {
    let binding = context.getBindingObject();
    binding.RelatedEntity = 'S4ServiceOrder';
    context.getPageProxy().setActionBinding(binding);
    return context.executeAction('/SAPAssetManager/Actions/S4RelatedHistories/S4RelatedHistoriesListViewNav.action');
}
