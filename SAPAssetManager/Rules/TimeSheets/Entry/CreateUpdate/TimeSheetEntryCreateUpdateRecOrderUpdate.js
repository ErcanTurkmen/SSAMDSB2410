import libCom from '../../../Common/Library/CommonLibrary';
import {TimeSheetLibrary as libTS, TimeSheetEventLibrary as libTSEvent} from '../../TimeSheetLibrary';
import libVal from '../../../Common/Library/ValidationLibrary';
import ResetValidationOnInput from '../../../Common/Validation/ResetValidationOnInput';
import operationOnChange from './TimeSheetEntryCreateUpdateOperationUpdate';

export default async function TimeSheetEntryCreateUpdateRecOrderUpdate(controlProxy) {
    ResetValidationOnInput(controlProxy);
    let pageProxy = controlProxy.getPageProxy();
    let selection = controlProxy.getValue()[0] ? controlProxy.getValue()[0].ReturnValue : '';
    let opListPickerProxy = libCom.getControlProxy(pageProxy,'OperationLstPkr');
    let subOpListPickerProxy = libCom.getControlProxy(pageProxy,'SubOperationLstPkr');
    let activityListPickerProxy = libCom.getControlProxy(pageProxy,'ActivityTypeLstPkr');

     /**
     * Returns controlkeys whose confirmation indicator does not equal '3'
     * Operations with a controlkey whose confirmation indicator is 3 cannot be confirmed
     */
    function getConfirmableControlKeys() {
        return controlProxy.read('/SAPAssetManager/Services/AssetManager.service', 'ControlKeys', ['ControlKey'], "$filter=ConfirmationIndicator ne '3'").then(function(result) {
            return result.map(({ ControlKey }) => ControlKey);
        });
    }

    let result = await Promise.all([getConfirmableControlKeys()]);
    const confirmableControlKeys = result[0]; //Confirmable control keys
    const confirmableControlKeyFilter = "$filter=ControlKey eq '" + Array.from(confirmableControlKeys).join("' or ControlKey eq '") + "'&"; //Filter string built from confirmable control keys

    if (libVal.evalIsEmpty(selection)) { //No order, so disable and empty op and sub-op pickers
        libTSEvent.ToggleNonWorkOrderRelatedFields(pageProxy, true); //enable when no workorder is selected
        opListPickerProxy.setValue('');
        subOpListPickerProxy.setValue('');
        let entity = 'MyWorkOrderOperations';
        let filter = confirmableControlKeyFilter + '$orderby=OperationNo asc'; //Only show operations that can be confirmed
        return libTS.setOperationSpecifier(opListPickerProxy, entity, filter).then(() => {
            libCom.setFormcellNonEditable(opListPickerProxy);
            libCom.setFormcellNonEditable(subOpListPickerProxy);
            libCom.setFormcellNonEditable(activityListPickerProxy);
            entity = 'MyWorkOrderSubOperations';
            filter = confirmableControlKeyFilter + '$orderby=OperationNo asc'; //Only show suboperations that can be confirmed
            return libTS.setSubOperationSpecifier(subOpListPickerProxy, entity, filter);
        });
    } else {
        libTSEvent.ToggleNonWorkOrderRelatedFields(pageProxy, false); //disable when workorder is selected
        libCom.setFormcellEditable(opListPickerProxy);
        let entity = selection + '/Operations';
        let filter = confirmableControlKeyFilter + '$orderby=OperationNo asc'; //Only show operations that can be confirmed

        opListPickerProxy.setValue('');
        subOpListPickerProxy.setValue('');

        await libTS.setOperationSpecifier(opListPickerProxy, entity, filter); //Populate op picker from chosen order
        let operation = opListPickerProxy.getValue(); //Did MDK auto-set a single picker value?
        let newWorkCenter = await libTS.GetWorkCenterFromObject(pageProxy, selection);

        if (newWorkCenter) {
            await libTS.updateWorkCenter(controlProxy.getPageProxy(), newWorkCenter);
        }
        if (operation) { //Default sub-operation picker values if mdk auto-selected an operation
            return operationOnChange(opListPickerProxy);
        }
        //No operation, so disable and empty the sub-op picker
        libCom.setFormcellNonEditable(subOpListPickerProxy);
        entity = 'MyWorkOrderSubOperations';
        filter = "$filter=ControlKey ne 'PM07'&SubOperationNo eq ''";
        return libTS.setSubOperationSpecifier(subOpListPickerProxy, entity, filter);
    }
}
