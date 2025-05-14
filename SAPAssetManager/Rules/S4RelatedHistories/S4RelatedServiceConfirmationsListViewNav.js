
export default function S4RelatedServiceConfirmationsListViewNav(context) {
    let binding = context.getBindingObject();
    binding.RelatedEntity = 'S4ServiceConfirmation';
    context.getPageProxy().setActionBinding(binding);
    return context.executeAction('/SAPAssetManager/Actions/S4RelatedHistories/S4RelatedHistoriesListViewNav.action');
}
