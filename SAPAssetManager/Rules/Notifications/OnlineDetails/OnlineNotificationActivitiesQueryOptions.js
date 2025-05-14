import IsOnlineNotificationItem from '../../OnlineSearch/Notifications/IsOnlineNotificationItem';

export default function OnlineNotificationActivitiesQueryOptions(context) {
    if (IsOnlineNotificationItem(context.getPageProxy())) {
        return '$expand=Item/Notification&$orderby=ActivitySortNumber asc';
    } else {
        return '$expand=Notification&$orderby=ActivitySortNumber asc';
    }
}
