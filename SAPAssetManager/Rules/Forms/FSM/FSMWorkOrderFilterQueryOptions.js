import { WorkOrderLibrary as libWO } from '../../WorkOrders/WorkOrderLibrary';
import IsS4ServiceIntegrationEnabled from '../../ServiceOrders/IsS4ServiceIntegrationEnabled';

/**
 * Return list of work or service orders that have Smartforms
 * @param {*} context 
 * @returns 
 */
export default function FSMWorkOrderFilterQueryOptions(context) {
    let s4 = IsS4ServiceIntegrationEnabled(context);
    let filter = '$orderby=OrderId&$filter=sap.entityexists(Operations/FSMFormInstance_Nav)';

    if (s4) {
        filter = '$orderby=ObjectID&$filter=sap.entityexists(ServiceItems_Nav/FSMFormInstance_Nav)';
        if (context.binding && context.binding.ObjectID) {
            filter += " and ObjectID eq '" + context.binding.ObjectID + "'";
        }
        return filter;
    }
    if (context.binding && context.binding.OrderId) {
        filter += " and OrderId eq '" + context.binding.OrderId + "'";
    }
    return libWO.attachWorkOrdersFilterByAssgnTypeOrWCM(context, filter);
}
