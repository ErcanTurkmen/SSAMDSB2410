import libCom from '../../Common/Library/CommonLibrary';
import filterOnLoaded from '../../Filter/FilterOnLoaded';
import IsS4ServiceIntegrationEnabled from '../../ServiceOrders/IsS4ServiceIntegrationEnabled';

export default function FSMListFilterOnLoaded(context) {
    let s4 = IsS4ServiceIntegrationEnabled(context);
    let prefix = (s4) ? 'S4' : '';
    let parentKey = getParentKey(context, s4);
    let clientData = context.evaluateTargetPath('#Page:FSMSmartFormsInstancesListViewPage/#ClientData');
    let operationFilter = context.evaluateTargetPath('#Page:FSMFilterPage/#Control:' + prefix + 'OperationFilter');
    let workOrderFilter = context.evaluateTargetPath('#Page:FSMFilterPage/#Control:' + prefix + 'WorkOrderFilter');

    filterOnLoaded(context); //Run the default filter on loaded
    if (clientData && clientData.workOrderFilter !== undefined) { //Displaying entire list with saved parent/child from previous filter
        let workOrderSelection = clientData.workOrderFilter;
        workOrderFilter.setValue(workOrderSelection);
        libCom.setFormcellEditable(operationFilter);
        let filter = "$orderby=OperationNo&$filter=sap.entityexists(FSMFormInstance_Nav) and OrderId eq '" + workOrderSelection + "'";
        if (s4) filter = "$orderby=ItemNo&$filter=sap.entityexists(FSMFormInstance_Nav) and ObjectID eq '" + workOrderSelection + "'";
        let pageProxy = context.getPageProxy();
        let opListPickerProxy = libCom.getControlProxy(pageProxy, prefix + 'OperationFilter');
        return setOperationSpecifier(opListPickerProxy, filter).then(() => {
            if (libCom.isDefined(clientData.operationFilter)) {
                operationFilter.setValue(clientData.operationFilter);
            }
            return Promise.resolve(true);
        });
    } else { //Displaying from operation/item details - no order/operation filter allowed in this case
        if (context.binding && parentKey) {
            libCom.setFormcellNonEditable(operationFilter);
            libCom.setFormcellNonEditable(workOrderFilter);
        } else { //Displaying entire list, with no parent order
            libCom.setFormcellNonEditable(operationFilter);
        }
    }
}

/**
 * Reload the operation/item picker based on parent selection
 * @param {*} picker 
 * @param {*} filter 
 * @returns 
 */
function setOperationSpecifier(picker, filter) {
    let specifier = picker.getTargetSpecifier();
    specifier.setQueryOptions(filter);
    return picker.setTargetSpecifier(specifier);
}

function getParentKey(context, s4) {
    let parentKey;
    if (context.binding) {
        parentKey = context.binding.OrderId;
        if (s4) parentKey = context.binding.ObjectID;
    }
    return parentKey;
}
