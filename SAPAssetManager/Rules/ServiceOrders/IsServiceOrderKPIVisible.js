import MobileStatusLibrary from '../MobileStatus/MobileStatusLibrary';
import IsS4ServiceIntegrationEnabled from './IsS4ServiceIntegrationEnabled';
import IsClassicLayoutEnabled from '../Common/IsClassicLayoutEnabled';

export default function IsServiceOrderKPIVisible(context) {
    if (IsS4ServiceIntegrationEnabled(context)) {
        return MobileStatusLibrary.isServiceOrderStatusChangeable(context);
    } else {
        return IsClassicLayoutEnabled(context) && MobileStatusLibrary.isHeaderStatusChangeable(context);
    }
}
