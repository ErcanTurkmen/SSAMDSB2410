import libCom from '../../Common/Library/CommonLibrary';
import WorkOrderCompletionLibrary from './WorkOrderCompletionLibrary';

export default function IsNotCompleteAction(context) {
    const confirmationHideCancelOption = libCom.getStateVariable(context, 'ConfirmationHideCancelOption');
    if (confirmationHideCancelOption) {
        return false;
    }
    let flagName = WorkOrderCompletionLibrary.getInstance().getCompleteFlagName(context);
    return !libCom.getStateVariable(context, flagName);
}
