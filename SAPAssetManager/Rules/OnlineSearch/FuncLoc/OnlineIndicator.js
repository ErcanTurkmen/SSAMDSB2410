import { IsOnlineEntityAvailableOffline } from '../IsOnlineEntityAvailableOffline';

export default async function OnlineIndicator(context) {
    const isAvailableOffline = await IsOnlineEntityAvailableOffline(context, 'MyFunctionalLocations', 'FuncLocIdIntern');

    return isAvailableOffline ? [''] : ['/SAPAssetManager/Images/online_OS.png'];
}
