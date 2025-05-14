import PersonaLibrary from '../Persona/PersonaLibrary';
import IsS4ServiceIntegrationEnabled from '../ServiceOrders/IsS4ServiceIntegrationEnabled';

export default function IsS4SidePanelEnabled(context) {
    return PersonaLibrary.isFieldServiceTechnician(context) && IsS4ServiceIntegrationEnabled(context);
}
