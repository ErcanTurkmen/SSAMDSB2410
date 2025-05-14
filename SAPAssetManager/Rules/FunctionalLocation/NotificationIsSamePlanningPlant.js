import PersonaLibrary from '../Persona/PersonaLibrary';
import IsS4ServiceIntegrationEnabled from '../ServiceOrders/IsS4ServiceIntegrationEnabled';
import isNotificationCreateEnabled from '../UserAuthorizations/Notifications/EnableNotificationCreate';

export default function NotificationIsSamePlanningPlant(context) {
    if (IsS4ServiceIntegrationEnabled(context) && PersonaLibrary.isFieldServiceTechnician(context)) {
        return false;
    }

    return isNotificationCreateEnabled(context);
}
