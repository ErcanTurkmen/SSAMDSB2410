import EquipmentDetailsNav from '../../Equipment/EquipmentDetailsNav';
import { EquipmentLibrary as libEquipment } from '../../Equipment/EquipmentLibrary';
import Logger from '../../Log/Logger';
import { IsOnlineEntityAvailableOffline } from '../IsOnlineEntityAvailableOffline';
import IsOnlineNotification from '../Notifications/IsOnlineNotification';

/**
* Navigates to either offline or online equipment details page based on whether equipment is available offline or not
* @param {IClientAPI} context
*/
export default async function OnlineSearchEquipmentDetailsNav(context) {
    let pageProxy = context.getPageProxy();

    const isHeaderEquipmentAvailableOffline = await IsOnlineEntityAvailableOffline(pageProxy, 'MyEquipments', 'HeaderEquipment');
    const isEquipmentAvailableOffline = await IsOnlineEntityAvailableOffline(pageProxy, 'MyEquipments', 'EquipId');

    if (IsOnlineNotification(context) && isHeaderEquipmentAvailableOffline) {
        return EquipmentDetailsNav(context);
    }

    if (isEquipmentAvailableOffline) {
        return EquipmentDetailsNav(context);
    }
    
    const actionContext = pageProxy.getActionBinding();
    const queryOpts = libEquipment.onlineEquipmentDetailsQueryOptions();

    context.showActivityIndicator();
    return context.read('/SAPAssetManager/Services/OnlineAssetManager.service', actionContext['@odata.readLink'], [], queryOpts).then(results => {
        pageProxy.setActionBinding(results.getItem(0));
        return context.executeAction('/SAPAssetManager/Actions/Equipment/OnlineEquipmentDetailsNav.action');
    }, error => {
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryEquipment.global').getValue(), error);
    }).finally(() => context.dismissActivityIndicator());
}
