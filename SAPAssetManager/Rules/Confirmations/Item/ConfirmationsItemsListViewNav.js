import S4ServiceLibrary from '../../ServiceOrders/S4ServiceLibrary';

/**
* Nav to confirmation item details page with predefined query
* @param {IClientAPI} context
*/
export default function ConfirmationsItemsListViewNav(context) {
    const filter = `$filter=ObjectID eq '${context.getPageProxy().binding.ObjectID}'`;
    let actionBinding = {
        isInitialFilterNeeded: true,
    };
    context.getPageProxy().setActionBinding(actionBinding);
    S4ServiceLibrary.setConfirmationItemFilters(context, filter);
    return context.executeAction('/SAPAssetManager/Actions/Confirmations/Item/ConfirmationsItemsListViewNav.action');
}
