import libCom from '../Common/Library/CommonLibrary';
import ResetNotificationFlags from './ResetNotificationFlags';

/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function CheckForChangesBeforeCancel(context) {
    if (libCom.unsavedChangesPresent(context)) {
        return context.executeAction('/SAPAssetManager/Actions/Notifications/CreateUpdate/ConfirmCancel.action');
    } else {
        return ResetNotificationFlags(context);
    }
}
