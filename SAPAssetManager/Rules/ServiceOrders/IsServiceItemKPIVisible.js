import MobileStatusLibrary from '../MobileStatus/MobileStatusLibrary';
import IsS4ServiceIntegrationEnabled from './IsS4ServiceIntegrationEnabled';
import IsClassicLayoutEnabled from '../Common/IsClassicLayoutEnabled';

export default function IsServiceItemKPIVisible(context) {
    if (IsS4ServiceIntegrationEnabled(context)) {
        return MobileStatusLibrary.isServiceItemStatusChangeable(context);
    } else {
        return IsClassicLayoutEnabled(context) && MobileStatusLibrary.isOperationStatusChangeable(context);
    }
}
