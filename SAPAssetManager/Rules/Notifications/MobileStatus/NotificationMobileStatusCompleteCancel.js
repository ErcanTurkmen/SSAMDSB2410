import AnalyticsManager from '../../AnalyticsManager/AnalyticsManagerLibrary';
/**
* Function to handle the notification when the complete action is cancelled
* Currently only used to handle AnalyticsManager trigger
*/
export default function NotificationMobileStatusCompleteCancel() {
    AnalyticsManager.notificationCompleteCancel();
}
