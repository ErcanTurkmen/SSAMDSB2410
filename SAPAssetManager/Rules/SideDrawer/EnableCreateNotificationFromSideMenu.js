import EnableNotificationCreate from '../UserAuthorizations/Notifications/EnableNotificationCreate';
import IsPMNotificationEnabled from '../UserFeatures/IsPMNotificationEnabled';

export default function EnableCreateNotificationFromSideMenu(clientAPI) {
    return IsPMNotificationEnabled(clientAPI) && EnableNotificationCreate(clientAPI);
}
