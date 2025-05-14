/**
* Show/Hide Notification Add popover if Notification completed or both edit and Work Order create is disabled based on User Authorization
* @param {IClientAPI} context
*/
import enableNotificationEdit from './EnableNotificationEdit';
import NotificationCreateWorkOrderVisible from '../../Notifications/Details/NotificationCreateWorkOrderVisible';
import libMobile from '../../Notifications/MobileStatus/NotificationMobileStatusLibrary';

export default function EnableNotificationCreateEdit(context) {
    return libMobile.isNotificationComplete(context).then(isComplete => {
        if (isComplete) {
            return false;
        }

        let editNotif = enableNotificationEdit(context);
        return NotificationCreateWorkOrderVisible(context).then(woResult => {
            return editNotif || woResult;
        });
    });
}
