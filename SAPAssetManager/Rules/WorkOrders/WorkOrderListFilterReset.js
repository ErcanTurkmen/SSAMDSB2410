/**
* Describe this function...
* @param {IClientAPI} context
*/
import FilterReset from '../Filter/FilterReset';
import phaseFilterReset from '../PhaseModel/PhaseModelFilterPickerReset';

export default function WorkOrderListFilterReset(context) {
    phaseFilterReset(context, 'PhaseFilter');

    let clientData = context.evaluateTargetPath('#Page:-Previous/#ClientData');

    if (clientData && clientData.dueDateSwitch !== undefined) {
        clientData.dueDateSwitch = undefined;
        clientData.dueStartDate = '';
        clientData.dueEndDate = '';
    }
    if (clientData && clientData.reqDateSwitch !== undefined) {
        clientData.reqDateSwitch = undefined;
        clientData.reqStartDate = '';
        clientData.reqEndDate = '';
    }
    if (clientData && clientData.OrderProcessingContext) {
        clientData.OrderProcessingContext = false;
    }
    FilterReset(context);
}
