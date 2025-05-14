import S4ServiceLibrary from '../ServiceOrders/S4ServiceLibrary';
import IsS4ServiceIntegrationEnabled from '../ServiceOrders/IsS4ServiceIntegrationEnabled';

export default function ExpensesListView(context) {
    if (IsS4ServiceIntegrationEnabled(context)) {
        let categories = S4ServiceLibrary.getServiceProductExpenseCategories(context);
        S4ServiceLibrary.setServiceItemsFilterCriterias(context, []);
        return S4ServiceLibrary.getItemsCategoriesFilterCriteria(context, categories, context.localizeText('expense')).then(filter => {
            S4ServiceLibrary.setServiceItemsFilterCriterias(context, filter);
            return context.executeAction('/SAPAssetManager/Actions/ServiceOrders/ServiceItemsListViewNav.action');
        });
    }

    return context.executeAction('/SAPAssetManager/Actions/Expenses/ExpensesListView.action');
}
