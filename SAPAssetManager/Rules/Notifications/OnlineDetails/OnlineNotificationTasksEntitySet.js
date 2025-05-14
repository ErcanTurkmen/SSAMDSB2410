import IsOnlineNotificationItem from '../../OnlineSearch/Notifications/IsOnlineNotificationItem';

export default function OnlineNotificationTasksEntitySet(context) {
    if (IsOnlineNotificationItem(context.getPageProxy())) {
        return context.getPageProxy().binding['@odata.readLink'] + '/ItemTasks';
    } else {
        return context.getPageProxy().binding['@odata.readLink'] + '/Tasks';
    }
}
