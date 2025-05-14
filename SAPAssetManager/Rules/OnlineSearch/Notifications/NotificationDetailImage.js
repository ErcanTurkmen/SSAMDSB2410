import PersonaLibrary from '../../Persona/PersonaLibrary';
import GetOnlineDetailsImage from '../GetOnlineDetailsImage';

export default function NotificationDetailImage(context) {
    if (!PersonaLibrary.isClassicHomeScreenEnabled(context)) {
        return isOnlineSearchActive(context) ? GetOnlineDetailsImage(context) : '$(PLT, /SAPAssetManager/Images/DetailImages/Notification.png, /SAPAssetManager/Images/DetailImages/Notification.android.png)';
    }
    return undefined;
}

export function isOnlineSearchActive(context) {
    try {
        return context.evaluateTargetPathForAPI('#Page:OnlineSearch');
    } catch {
        return false;
    }
}
