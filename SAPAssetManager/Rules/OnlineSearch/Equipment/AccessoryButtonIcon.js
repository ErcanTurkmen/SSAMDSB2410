import { IsOnlineEntityAvailableOffline } from '../IsOnlineEntityAvailableOffline';
import { getIcon } from '../Notifications/AccessoryButtonIcon';
import libSearch from '../OnlineSearchLibrary';

/**
* If device is android and entity is available for download, display download icon, otherwise no icon
* @param {IClientAPI} context
*/
export default async function AccessoryButtonIcon(context) {
    const isAvailableOffline = await IsOnlineEntityAvailableOffline(context, 'MyEquipments', 'EquipId');
    return !isAvailableOffline &&
        !libSearch.isCurrentListInSelectionMode(context) ?
        getIcon() :
        '';
}
