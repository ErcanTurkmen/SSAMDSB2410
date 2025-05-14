import EnableNotificationCreate from '../UserAuthorizations/Notifications/EnableNotificationCreate';
import IsS4SidePanelDisabled from './IsS4SidePanelDisabled';

export default function EnableCreateNotificationFSMCSPersona(clientAPI) {
    return IsS4SidePanelDisabled(clientAPI) && EnableNotificationCreate(clientAPI);
}
