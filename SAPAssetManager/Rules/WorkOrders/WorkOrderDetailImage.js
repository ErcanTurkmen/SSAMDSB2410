import libPersona from '../Persona/PersonaLibrary';
import GetOnlineDetailsImage from '../OnlineSearch/GetOnlineDetailsImage';
import { isOnlineSearchActive } from '../OnlineSearch/Notifications/NotificationDetailImage';

export default function WorkOrderDetailImage(context) {
    if (!libPersona.isClassicHomeScreenEnabled(context)) {
        return isOnlineSearchActive(context) ? GetOnlineDetailsImage(context) : '$(PLT, /SAPAssetManager/Images/DetailImages/WO.png, /SAPAssetManager/Images/DetailImages/WO.android.png)';
    }
    return undefined;
}
