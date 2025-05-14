import IsPhaseModelEnabled from '../../../Common/IsPhaseModelEnabled';
import IsNotificationMinor from '../../MobileStatus/IsNotificationMinor';
import MobileStatusLibrary from '../../../MobileStatus/MobileStatusLibrary';
import EnableNotificationEdit from '../../../UserAuthorizations/Notifications/EnableNotificationEdit';

export default function EnableNotificationTaskCreate(context) {
    if (EnableNotificationEdit(context)) {
        return !(IsPhaseModelEnabled(context) && IsNotificationMinor(context, MobileStatusLibrary.getMobileStatus(context.binding, context)));
    } else {
        return false;
    }
}
