import IsWONotificationVisible from './Complete/Notification/IsWONotificationVisible';
import WorkOrderCompletionLibrary from './Complete/WorkOrderCompletionLibrary';
import libCommon from '../Common/Library/CommonLibrary';
import {ChecklistLibrary} from '../Checklists/ChecklistLibrary';
import SmartFormsCompletionLibrary from '../Forms/SmartFormsCompletionLibrary';

export default function NavOnCompleteWorkOrderPage(context, actionBinding) {
    context.dismissActivityIndicator(); // RunMobileStatusUpdateSequence triggers showActivityIndicator which may result in infinite loading when CheckRequiredFields action is executed.

    const binding = actionBinding || context.getPageProxy().getActionBinding() || libCommon.getBindingObject(context);

    return ChecklistLibrary.allowWorkOrderComplete(context, binding.HeaderEquipment, binding.HeaderFunctionLocation).then(async results => { //Check for non-complete checklists and ask for confirmation
        if (results === true) {
            WorkOrderCompletionLibrary.getInstance().setCompletionFlow('');
            await WorkOrderCompletionLibrary.getInstance().initSteps(context);
            WorkOrderCompletionLibrary.getInstance().setBinding(context, binding);
            return IsWONotificationVisible(context, binding, 'Notification').then((notification) => {
                if (notification) {
                    WorkOrderCompletionLibrary.updateStepState(context, 'notification', {
                        visible: true,
                        data: JSON.stringify(notification),
                        link: notification['@odata.editLink'],
                        initialData: JSON.stringify(notification),
                    });
                } else {
                    WorkOrderCompletionLibrary.updateStepState(context, 'notification', {
                        visible: false,
                    });
                }
                return SmartFormsCompletionLibrary.updateSmartformStep(context).then(() => {
                    WorkOrderCompletionLibrary.getInstance().setCompleteFlag(context, true);
                    return WorkOrderCompletionLibrary.getInstance().openMainPage(context, false);
                });
            });
        }
        return false;
    });
}
