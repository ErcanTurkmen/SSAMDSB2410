import NotificationMobileStatusLibrary from './NotificationMobileStatusLibrary';

export default function NotificationCompletePhaseModel(context) {
    return NotificationMobileStatusLibrary.showNotificationCompleteWarningMessage(context).then(proceed => {
        if (proceed) {
            return NotificationMobileStatusLibrary.completeNotification(context);
        } else {
            return '';
        }
    });
}
