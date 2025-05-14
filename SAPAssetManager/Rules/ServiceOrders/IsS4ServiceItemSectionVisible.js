import MobileStatusLibrary from '../MobileStatus/MobileStatusLibrary';
import IsS4ServiceIntegrationEnabled from './IsS4ServiceIntegrationEnabled';
import PersonaLibrary from '../Persona/PersonaLibrary';

export default function IsS4ServiceItemSectionVisible(context) {
    if (IsS4ServiceIntegrationEnabled(context) && PersonaLibrary.isFieldServiceTechnician(context)) {
        return MobileStatusLibrary.isServiceItemStatusChangeable(context);
    }

    return false;
}
