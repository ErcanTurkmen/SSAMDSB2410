import IsCompleteAction from '../WorkOrders/Complete/IsCompleteAction';
import CommonLibrary from '../Common/Library/CommonLibrary';

//cancels back navigation
//if a false is returned then the back navigation is cancelled
export default function OnSignatureBackButtonPressed(context) {
    if (IsCompleteAction(context)) {
        const messageText = context.localizeText('status_will_be_updated');
        const captionText = context.localizeText('warning');
        return CommonLibrary.showWarningDialog(context, messageText, captionText).then(result => {
            return result;
        });
    }
    return true;
}
