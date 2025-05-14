/**
* Show/Hide Notification edit button based on User Authorization
* @param {IClientAPI} context
*/
import libCom from '../../Common/Library/CommonLibrary';
import IsWCMOperator from '../../WCM/IsWCMOperator';
import IsPMNotificationEnabled from '../../UserFeatures/IsPMNotificationEnabled';
import IsCSNotificationEnabled from '../../UserFeatures/IsCSNotificationEnabled';

export default function EnableNotificationEdit(context, customBinding) {
    const enableEdit = (IsPMNotificationEnabled(context) && libCom.getAppParam(context, 'USER_AUTHORIZATIONS', 'Enable.NO.Edit') === 'Y') ||
        (IsCSNotificationEnabled(context) && libCom.getAppParam(context, 'USER_AUTHORIZATIONS', 'Enable.SNO.Edit') === 'Y');

    const myNotificationHeader = customBinding || context.binding;
    if (IsWCMOperator(context)) {
        return libCom.isCurrentReadLinkLocal(myNotificationHeader['@odata.readLink']);
    }
    return (enableEdit || libCom.isCurrentReadLinkLocal(myNotificationHeader['@odata.readLink']));
}
