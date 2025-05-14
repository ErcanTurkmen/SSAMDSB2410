import PersonaLibrary from '../Persona/PersonaLibrary';
import IsS4ServiceIntegrationEnabled from '../ServiceOrders/IsS4ServiceIntegrationEnabled';
import isWOCreateEnabled from '../UserAuthorizations/WorkOrders/EnableWorkOrderCreate';

export default function WorkOrderIsSamePlanningPlant(context) {
    if (IsS4ServiceIntegrationEnabled(context) && PersonaLibrary.isFieldServiceTechnician(context)) {
        return false;
    }

    return isWOCreateEnabled(context);
}
