import GetOnlineDetailsImage from '../OnlineSearch/GetOnlineDetailsImage';
import { isOnlineSearchActive } from '../OnlineSearch/Notifications/NotificationDetailImage';
import libPersona from '../Persona/PersonaLibrary';

export default function EquipmentDetailImage(context) {
    if (!libPersona.isClassicHomeScreenEnabled(context)) {
        return isOnlineSearchActive(context) ?
            GetOnlineDetailsImage(context) :
            '$(PLT, /SAPAssetManager/Images/DetailImages/Equipment.png, /SAPAssetManager/Images/DetailImages/Equipment.android.png)';
    }

    return undefined;
}
