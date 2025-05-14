/**
* Show/Hide Notification create button based on User Authorization
* @param {IClientAPI} context
*/
import libCom from '../../Common/Library/CommonLibrary';
import IsPMNotificationEnabled from '../../UserFeatures/IsPMNotificationEnabled';
import IsCSNotificationEnabled from '../../UserFeatures/IsCSNotificationEnabled';

export default function EnableNotificationCreate(context) {
    return ((IsPMNotificationEnabled(context) && libCom.getAppParam(context, 'USER_AUTHORIZATIONS', 'Enable.NO.Create') === 'Y') || 
        (IsCSNotificationEnabled(context) && libCom.getAppParam(context, 'USER_AUTHORIZATIONS', 'Enable.SNO.Create') === 'Y'));
}
