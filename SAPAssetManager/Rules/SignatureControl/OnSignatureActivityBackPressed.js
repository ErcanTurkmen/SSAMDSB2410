import IsCompleteAction from '../WorkOrders/Complete/IsCompleteAction';
import CommonLibrary from '../Common/Library/CommonLibrary';
import WorkOrderCompletionLibrary from '../WorkOrders/Complete/WorkOrderCompletionLibrary';

//cancels back navigation
//set cancel to true in ClientAPI.getAppEventData() then the back navigation is cancelled
export default function OnSignatureActivityBackPressed(context) {
    if (IsCompleteAction(context)) {
        context.getAppEventData().cancel = true;

        const messageText = context.localizeText('status_will_be_updated');
        const captionText = context.localizeText('warning');
        return CommonLibrary.showWarningDialog(context, messageText, captionText).then(result => {
            if (result) {
                WorkOrderCompletionLibrary.getInstance().openMainPage(context);
            }
        });
    }
}
