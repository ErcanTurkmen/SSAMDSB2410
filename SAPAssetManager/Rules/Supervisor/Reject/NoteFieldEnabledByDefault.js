import IsS4ServiceIntegrationEnabled from '../../ServiceOrders/IsS4ServiceIntegrationEnabled';

export default function NoteFieldEnabledByDefault(clientAPI) {
    return !IsS4ServiceIntegrationEnabled(clientAPI);
}
