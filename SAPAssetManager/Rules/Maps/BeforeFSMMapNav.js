import BeforeMapNav from './BeforeMapNav';
import IsS4ServiceIntegrationEnabled from '../ServiceOrders/IsS4ServiceIntegrationEnabled';

export default function BeforeFSMMapNav(clientAPI) {
    if (IsS4ServiceIntegrationEnabled(clientAPI)) {
        return BeforeMapNav(clientAPI, '/SAPAssetManager/Actions/Extensions/FSMS4MapNav.action');
    } else {
        return BeforeMapNav(clientAPI, '/SAPAssetManager/Actions/Extensions/FSMMapNav.action');
    }
}
