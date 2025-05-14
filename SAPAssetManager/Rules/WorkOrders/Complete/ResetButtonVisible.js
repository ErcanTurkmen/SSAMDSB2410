import libCom from '../../Common/Library/CommonLibrary';
import WorkOrderCompletionLibrary from './WorkOrderCompletionLibrary';
import isSyncInProgress from '../../Sync/IsSyncInProgress';

export default function ResetButtonVisible(context) {
    let expenses = libCom.getStateVariable(context, 'expenses');
    let smartforms = WorkOrderCompletionLibrary.getStep(context, 'smartforms').links || [];
    let isValuesExist = (expenses && expenses.length > 0) || WorkOrderCompletionLibrary.getStepValue(context, 'mileage') ||
        WorkOrderCompletionLibrary.getStepValue(context, 'notification') || WorkOrderCompletionLibrary.getStepValue(context, 'lam') ||
        WorkOrderCompletionLibrary.getStepValue(context, 'time') || WorkOrderCompletionLibrary.getStepValue(context, 'note') ||
        WorkOrderCompletionLibrary.getStepValue(context, 'signature') || WorkOrderCompletionLibrary.getStepValue(context, 'digit_signature') ||
        WorkOrderCompletionLibrary.getStepValue(context, 'confirmation') || WorkOrderCompletionLibrary.getStepValue(context, 'confirmation_item') ||
        smartforms.length;

    if (isSyncInProgress(context)) {
        isValuesExist = false; //Do not allow reset during a sync.  Causes a crash
    }
    return isValuesExist;
}
