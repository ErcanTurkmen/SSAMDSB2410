import libCom from '../../Common/Library/CommonLibrary';
import libEval from '../../Common/Library/ValidationLibrary';
import IsS4ServiceIntegrationEnabled from '../../ServiceOrders/IsS4ServiceIntegrationEnabled';
import RedrawFilterToolbar from '../../Filter/RedrawFilterToolbar';

export default function FSMWorkOrderFilterOnValueChange(context) {
    let pageProxy = context.getPageProxy();
    let returnValue = context.getValue()[0] ? context.getValue()[0].ReturnValue : '';
    let clientData = context.evaluateTargetPath('#Page:FSMSmartFormsInstancesListViewPage/#ClientData');
    let s4 = IsS4ServiceIntegrationEnabled(context);
    let prefix = (s4) ? 'S4' : '';
    let woListPickerProxy = libCom.getControlProxy(pageProxy, prefix + 'WorkOrderFilter');
    let opListPickerProxy = libCom.getControlProxy(pageProxy, prefix + 'OperationFilter');
    
    RedrawFilterToolbar(context);

    if (libEval.evalIsEmpty(returnValue)) { // No order, so disable and empty op pickers
        clientData.workOrderFilter = undefined;
        woListPickerProxy.setValue('');
        opListPickerProxy.setValue('');
        libCom.setFormcellNonEditable(opListPickerProxy);
        let filter = "$filter=OperationNo eq ''";
        if (s4) filter = "$filter=ItemNo eq ''";
        return setOperationSpecifier(opListPickerProxy, filter).then(() => {
            libCom.setFormcellNonEditable(opListPickerProxy);
            return Promise.resolve(true);
        });
    } else { // Populate op picker from chosen order
        clientData.workOrderFilter = context.getValue()[0].ReturnValue;
        libCom.setFormcellEditable(opListPickerProxy);
        let filter = "$orderby=OperationNo&$filter=sap.entityexists(FSMFormInstance_Nav) and OrderId eq '" + returnValue + "'";
        if (s4) {
            filter = "$orderby=ItemNo&$filter=sap.entityexists(FSMFormInstance_Nav) and ObjectID eq '" + returnValue + "'";
        }
        return setOperationSpecifier(opListPickerProxy, filter).then(() => {
            opListPickerProxy.setValue('');
            return Promise.resolve(true);
        });
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
