import PersonaLibrary from '../Persona/PersonaLibrary';
import IsS4ServiceIntegrationEnabled from '../ServiceOrders/IsS4ServiceIntegrationEnabled';

export default function IsS4Visible(context) {
    return PersonaLibrary.isFieldServiceTechnician(context) && IsS4ServiceIntegrationEnabled(context);
}
