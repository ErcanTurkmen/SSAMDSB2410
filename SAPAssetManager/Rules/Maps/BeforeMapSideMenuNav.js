import BeforeMapNav from './BeforeMapNav';
import libPersona from '../Persona/PersonaLibrary';
import IsS4ServiceIntegrationEnabled from '../ServiceOrders/IsS4ServiceIntegrationEnabled';
import BeforeMTSidemenuMapNav from './BeforeMTSidemenuMapNav';

export default function BeforeMapSideMenuNav(clientAPI) {
    if (libPersona.isWCMOperator(clientAPI)) {
        return BeforeMapNav(clientAPI, '/SAPAssetManager/Actions/Extensions/WCMMapSideMenuNav.action');
    } else if (libPersona.isFieldServiceTechnician(clientAPI)) {
        if (IsS4ServiceIntegrationEnabled(clientAPI)) {
            return BeforeMapNav(clientAPI, '/SAPAssetManager/Actions/Extensions/FSMS4MapNav.action');
        } else {
            return BeforeMapNav(clientAPI, '/SAPAssetManager/Actions/Extensions/FSMMapNav.action');
        }
    }

    return BeforeMTSidemenuMapNav(clientAPI);  // MT persona
}
