import { OperationLibrary as libOperations } from '../../WorkOrders/Operations/WorkOrderOperationLibrary';
import IsS4ServiceIntegrationEnabled from '../../ServiceOrders/IsS4ServiceIntegrationEnabled';

/**
 * Return list of operations or service items that have Smartforms
 * @param {*} context 
 * @returns 
 */
export default function FSMOperationFilterQueryOptions(context) {
    let s4 = IsS4ServiceIntegrationEnabled(context);
    let filter = '$orderby=OperationNo&$filter=sap.entityexists(FSMFormInstance_Nav)';

    if (s4) {
        filter = '$orderby=ItemNo&$filter=sap.entityexists(FSMFormInstance_Nav)';
        if (context.binding && context.binding.ItemNo) {
            filter += " and ItemNo eq '" + context.binding.ItemNo + "'";
        }
        return filter;
    }
    if (context.binding && context.binding.OperationNo) {
        filter += " and OperationNo eq '" + context.binding.OperationNo + "'";
    }
    return libOperations.attachOperationsFilterByAssgnTypeOrWCM(context, filter);
}
