import Logger from '../../Log/Logger';
import NotificationDetailsNavQueryOptions from '../Details/NotificationDetailsNavQueryOptions';
import NotificationDetailsNav from '../Details/NotificationDetailsNav';
import { IsOnlineEntityAvailableOffline } from '../../OnlineSearch/IsOnlineEntityAvailableOffline';

export default async function NavToNotificationOnlineDetailsPage(context) {
    const pageProxy = context.getPageProxy();
    const actionContext = pageProxy.getActionBinding();
    const isAvailableOffline = await IsOnlineEntityAvailableOffline(pageProxy, 'MyNotificationHeaders', 'NotificationNumber');

    if (isAvailableOffline ) {
        return readAndNavigateToOfflineNotification(pageProxy, actionContext.NotificationNumber);
    }

    try {
        const onlineNotification = await context.read('/SAPAssetManager/Services/OnlineAssetManager.service', actionContext['@odata.readLink'], [], '').then(result => result.length ? result.getItem(0) : null);
        if (onlineNotification) {
            pageProxy.setActionBinding(onlineNotification);
            return context.executeAction('/SAPAssetManager/Actions/Notifications/OnlineNotificationDetailsNav.action');
        }
    } catch (error) {
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryOnlineNotification.global').getValue(), error);
    }

    return Promise.resolve();
}

export function readAndNavigateToOfflineNotification(pageProxy, notificationNumber) {
    return pageProxy.read('/SAPAssetManager/Services/AssetManager.service', `MyNotificationHeaders('${notificationNumber}')`, [], NotificationDetailsNavQueryOptions(pageProxy)).then((result) => {
        pageProxy.setActionBinding(result.getItem(0));
        return NotificationDetailsNav(pageProxy, true);
    });
}
