import libCom from '../../Common/Library/CommonLibrary';
import ResetValidationOnInput from '../../Common/Validation/ResetValidationOnInput';
import MobileStatusLibrary from '../../MobileStatus/MobileStatusLibrary';
import SupervisorLibrary from '../../Supervisor/SupervisorLibrary';
import OnOperationChangeListPickerUpdate, {redrawListControl} from './OnOperationChangeListPickerUpdate';

export default async function OnOperationChanged(context) {
    let selection = context.getValue()[0] ? context.getValue()[0].ReturnValue : '';
    let pageProxy = context.getPageProxy();
    let opControl = libCom.getControlProxy(pageProxy, 'OperationPkr');
    let woLstPicker = libCom.getControlProxy(pageProxy, 'WorkOrderLstPkr');
    let accountIndicatorListPicker = libCom.getControlProxy(pageProxy, 'AcctIndicatorPkr');
    let orderId = woLstPicker.getValue()[0] ? woLstPicker.getValue()[0].ReturnValue : '';
    let binding = context.getBindingObject();
    let finalControl = libCom.getControlProxy(pageProxy, 'IsFinalConfirmation');

    /* Clear the validation if the field is not empty */
    ResetValidationOnInput(opControl);
    
    if (selection.length === 0) {
        return redrawListControl(pageProxy, 'SubOperationPkr', '', false, true).then(() => {
            return redrawListControl(pageProxy, 'ActivityTypePkr', '', false, true).then(() => {
                return redrawListControl(pageProxy, 'VarianceReasonPkr', '', false, true).then(() => {
                    pageProxy.getControl('FormCellContainer').redraw();
                    return true;
                });
            });
        });
    } else {
        //If Operation level assignment then check to see if review is required for the operation
        if (orderId && MobileStatusLibrary.isOperationStatusChangeable(pageProxy)) {
            let operation = await pageProxy.read('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderOperations', [],  `$expand=OperationMobileStatus_Nav,WOHeader&$filter=OrderId eq '${orderId}' and OperationNo eq '${selection}'`)
                .then(result => {
                    if (result.length > 0) {
                        accountIndicatorListPicker.setValue(result.getItem(0).WOHeader.AccountingIndicator);
                        return result.getItem(0);
                    }
                    return '';
                });

            if (operation) {
                checkReviewRequired(pageProxy, operation, finalControl, context, binding);
            }
        }
        
        return OnOperationChangeListPickerUpdate(pageProxy);
    }
}

async function checkReviewRequired(pageProxy, operation, finalControl, context, binding) {
    let review = await SupervisorLibrary.checkReviewRequired(pageProxy, operation);
    if (review && !MobileStatusLibrary.isSubOperationStatusChangeable(context)) { //If not sub-operation assignment and needs review, then don't allow final confirmation to be set by user
        finalControl.setValue(false);    
        finalControl.setEditable(false);
    } else if (binding && binding.IsFinalChangable) {
        finalControl.setEditable(true);
    }
}
