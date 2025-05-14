import IsOnlineNotificationItem from '../../OnlineSearch/Notifications/IsOnlineNotificationItem';
import NotificationActivitiesCount from '../Activity/NotificationsActivitiesCount';
import NotificationItemActivitiesCount from '../Item/Activity/CreateUpdate/NotificationItemActivitiesCount';

export default function OnlineNotificationActivitiesPageCaption(context) {
    if (IsOnlineNotificationItem(context)) {
        return NotificationItemActivitiesCount(context).then(count => {
            return context.localizeText('notification_items_activities_x',[count]);
        });
    } else {
        return NotificationActivitiesCount(context).then(count => {
            return context.localizeText('notification_activities_x',[count]);
        });
    }
}
