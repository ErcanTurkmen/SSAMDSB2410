import IsCompleteAction from '../../WorkOrders/Complete/IsCompleteAction';
import WorkOrderCompletionLibrary from '../../WorkOrders/Complete/WorkOrderCompletionLibrary';

export default function AfterDiscardS4ServiceConfirmationItem(context) {
    if (IsCompleteAction(context)) {
        WorkOrderCompletionLibrary.updateStepState(context, 'confirmation_item', {
            data: '',
            link: '',
            value: '',
        });
        return WorkOrderCompletionLibrary.getInstance().openMainPage(context);
    }

    return Promise.resolve();
}
