import GetOnlineDetailsImage from '../OnlineSearch/GetOnlineDetailsImage';
import { isOnlineSearchActive } from '../OnlineSearch/Notifications/NotificationDetailImage';
import libPersona from '../Persona/PersonaLibrary';

export default function FunctionaLocationDetailImage(context) {
    if (!libPersona.isClassicHomeScreenEnabled(context)) {
        return isOnlineSearchActive(context) ?
            GetOnlineDetailsImage(context) :
            '$(PLT, /SAPAssetManager/Images/DetailImages/Floc.png, /SAPAssetManager/Images/DetailImages/Floc.android.png)';
    }

    return undefined;
}
