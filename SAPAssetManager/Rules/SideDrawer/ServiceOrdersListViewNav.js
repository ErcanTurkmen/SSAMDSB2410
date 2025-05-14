import WorkOrdersListViewNav from '../WorkOrders/WorkOrdersListViewNav';
import IsS4ServiceIntegrationEnabled from '../ServiceOrders/IsS4ServiceIntegrationEnabled';
import CommonLibrary from '../Common/Library/CommonLibrary';

export default function ServiceOrdersListViewNav(context) {
    if (IsS4ServiceIntegrationEnabled(context)) {
        return context.executeAction('/SAPAssetManager/Actions/ServiceOrders/ServiceOrdersListViewNav.action');
    }

    CommonLibrary.setStateVariable(context, 'DATE_FILTER', 'true');
    CommonLibrary.setStateVariable(context, 'OPERATIONS_DATE_FILTER', 'true');
    return WorkOrdersListViewNav(context);
}
