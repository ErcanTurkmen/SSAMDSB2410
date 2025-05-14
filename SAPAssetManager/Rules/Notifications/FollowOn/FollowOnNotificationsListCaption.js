import FollowOnNotificationsCount from './FollowOnNotificationsCount';

export default function FollowOnNotificationsListCaption(context) {
    return FollowOnNotificationsCount(context).then(count => {
        return context.localizeText('follow_on_notification_count', [count]); 
    });
}
