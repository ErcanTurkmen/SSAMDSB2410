import FollowOnNotificationsCount from './FollowOnNotificationsCount';

export default function FollowOnNotificationsFooterIsVisible(context) {
    return FollowOnNotificationsCount(context).then(count => {
        return count > 1;
    });
}
