import IsOnlineNotificationItem from '../../OnlineSearch/Notifications/IsOnlineNotificationItem';
import NotificationItemTasksCount from '../Item/Task/NotificationItemTasksCount';
import NotificationTasksCount from '../Task/NotificationsTasksCount';

export default function OnlineNotificationTasksPageCaption(context) {
    if (IsOnlineNotificationItem(context)) {
        return NotificationItemTasksCount(context).then(count => {
            return context.localizeText('notification_item_tasks_x', [count]);
        });
    } else {
        return NotificationTasksCount(context).then(count => {
            return context.localizeText('notification_tasks_x', [count]);
        });
    }
}
