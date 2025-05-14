import IsOnlineNotificationItem from '../../OnlineSearch/Notifications/IsOnlineNotificationItem';

export default function OnlineNotificationActivitiesEntitySet(context) {
    if (IsOnlineNotificationItem(context.getPageProxy())) {
        return context.getPageProxy().binding['@odata.readLink'] + '/ItemActivities';
    } else {
        return context.getPageProxy().binding['@odata.readLink'] + '/Activities';
    }
}
