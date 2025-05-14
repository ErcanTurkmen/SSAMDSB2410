import IsOnCreate from '../../Common/IsOnCreate';
import IsS4ServiceIntegrationEnabled from '../../ServiceOrders/IsS4ServiceIntegrationEnabled';

export default function IsNoteTypeControlVisible(context) {
    return IsS4ServiceIntegrationEnabled(context) && IsOnCreate(context);
}
