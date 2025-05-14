import FollowOnNotificationsCount from './FollowOnNotificationsCount';

export default function FollowOnNotificationsIsVisible(context) {
    return FollowOnNotificationsCount(context).then(count => {
        return count > 0;
    });
}
