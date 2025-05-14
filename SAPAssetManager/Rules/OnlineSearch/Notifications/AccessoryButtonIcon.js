import { IsOnlineEntityAvailableOffline } from '../IsOnlineEntityAvailableOffline';
import libSearch from '../OnlineSearchLibrary';

/**
* @param {IClientAPI} context
*/
export default async function AccessoryButtonIcon(context) {
    const isNotitficationCompleted = context.binding.SystemStatus.includes('NOCO'); //Hide button if contain status "Notification Completed"
    const isAvailableOffline = await IsOnlineEntityAvailableOffline(context, 'MyNotificationHeaders', 'NotificationNumber');
    return !isAvailableOffline && !isNotitficationCompleted &&
        !libSearch.isCurrentListInSelectionMode(context) ?
        getIcon() :
        '';
}

export function getIcon() {
    return '$(PLT, /SAPAssetManager/Images/OCDownload.png, /SAPAssetManager/Images/make_available_offline.android.png)';
}
