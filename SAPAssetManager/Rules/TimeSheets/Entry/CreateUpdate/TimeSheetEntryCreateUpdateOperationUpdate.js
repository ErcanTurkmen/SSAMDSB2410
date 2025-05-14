import {TimeSheetLibrary as libTS} from '../../TimeSheetLibrary';
import libCom from '../../../Common/Library/CommonLibrary';
import ResetValidationOnInput from '../../../Common/Validation/ResetValidationOnInput';

export default function TimeSheetEntryCreateUpdateOperationUpdate(controlProxy) {
    ResetValidationOnInput(controlProxy);
    let pageProxy = controlProxy.getPageProxy();
    let recOrderProxy = libCom.getControlProxy(pageProxy, 'RecOrderLstPkr');
    
    if (recOrderProxy) {
        let selection = controlProxy.getValue()[0] ? controlProxy.getValue()[0].ReturnValue : '';

        if (!selection) { //operation has been unchecked hence, get the workorder's workcenter and set the activity type picker accordingly
            selection = recOrderProxy.getValue()[0].ReturnValue;
        }

        let listPickerProxy = libCom.getControlProxy(pageProxy,'SubOperationLstPkr');
        return libTS.GetWorkCenterFromObject(pageProxy, selection).then(newWorkCenter => {
            return libTS.updateWorkCenter(pageProxy, newWorkCenter).then(() => {     
                return libTS.updateActivityType(pageProxy).then(() => {             
                    return libTS.ShouldEnableSubOperations(pageProxy).then(function(result) {                        
                        if (result) {
                            libCom.setFormcellEditable(listPickerProxy);
                            let entity = selection + '/SubOperations';
                            let filter = '$orderby=SubOperationNo asc';  
                            listPickerProxy.setValue('');                                         
                            return libTS.setSubOperationSpecifier(listPickerProxy, entity, filter);
                        } else {
                            libCom.setFormcellNonEditable(listPickerProxy);
                            let entity = 'MyWorkOrderSubOperations';
                            let filter = "$filter=SubOperationNo eq ''";
                            listPickerProxy.setValue('');   
                            return libTS.setSubOperationSpecifier(listPickerProxy, entity, filter);
                        }
                    });
                });
            });
        });
    }
    return Promise.resolve(true);  
}

