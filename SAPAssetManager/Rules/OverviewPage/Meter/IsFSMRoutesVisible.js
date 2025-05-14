import PersonaLibrary from '../../Persona/PersonaLibrary';
import IsS4ServiceIntegrationEnabled from '../../ServiceOrders/IsS4ServiceIntegrationEnabled';
import IsRoutesVisible from './IsRoutesVisible';

export default function IsFSMRoutesVisible(context) {
    return IsRoutesVisible(context) && PersonaLibrary.isFieldServiceTechnicianPro(context) && !IsS4ServiceIntegrationEnabled(context);
}
