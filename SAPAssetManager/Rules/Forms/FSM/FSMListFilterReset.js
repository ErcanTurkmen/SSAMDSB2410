import libCom from '../../Common/Library/CommonLibrary';
import FilterReset from '../../Filter/FilterReset';
import IsS4ServiceIntegrationEnabled from '../../ServiceOrders/IsS4ServiceIntegrationEnabled';

export default function FSMListFilterReset(context) {
    let s4 = IsS4ServiceIntegrationEnabled(context);
    let prefix = (s4) ? 'S4' : '';
    let clientData = context.evaluateTargetPath('#Page:FSMSmartFormsInstancesListViewPage/#ClientData');
    let operationFilter = context.evaluateTargetPath('#Page:FSMFilterPage/#Control:' + prefix + 'OperationFilter');
    let workOrderFilter = context.evaluateTargetPath('#Page:FSMFilterPage/#Control:' + prefix + 'WorkOrderFilter');

    if (context.binding && (context.binding.OrderId || context.binding.ObjectID)) { //Displaying from operation/item details - no order/operation filter allowed in this case
        libCom.setFormcellNonEditable(operationFilter);
        libCom.setFormcellNonEditable(workOrderFilter);
    }
    workOrderFilter.setValue('');
    operationFilter.setValue('');
    if (clientData) {
        clientData.workOrderFilter = undefined;
        clientData.operationFilter = undefined;
    }
    FilterReset(context);
}
