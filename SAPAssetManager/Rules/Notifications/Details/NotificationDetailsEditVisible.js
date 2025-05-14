import EnableNotificationEdit from '../../UserAuthorizations/Notifications/EnableNotificationEdit';
import libMobile from '../MobileStatus/NotificationMobileStatusLibrary';

export default function NotificationDetailsEditVisible(context) {
    return libMobile.isNotificationComplete(context).then(isComplete => {
        return isComplete ? false : EnableNotificationEdit(context);
    });
}
