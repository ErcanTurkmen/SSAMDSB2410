import { IsOnlineEntityAvailableOffline } from '../IsOnlineEntityAvailableOffline';

export default async function OnlineIndicator(context) {
    const isAvailableOffline = await IsOnlineEntityAvailableOffline(context, 'MyWorkOrderHeaders', 'OrderId');

    return isAvailableOffline ? [''] : ['/SAPAssetManager/Images/online_OS.png'];
}
