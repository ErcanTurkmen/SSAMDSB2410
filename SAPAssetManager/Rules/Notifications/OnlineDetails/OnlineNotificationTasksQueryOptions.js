import IsOnlineNotificationItem from '../../OnlineSearch/Notifications/IsOnlineNotificationItem';

export default function OnlineNotificationTasksQueryOptions(context) {
    if (IsOnlineNotificationItem(context.getPageProxy())) {
        return '$expand=Item/Notification&$orderby=TaskSortNumber asc';
    } else {
        return '$expand=Notification&$orderby=TaskSortNumber asc';
    }
}
