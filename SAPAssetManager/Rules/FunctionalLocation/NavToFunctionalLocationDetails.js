import Logger from '../Log/Logger';
import { IsOnlineEntityAvailableOffline } from '../OnlineSearch/IsOnlineEntityAvailableOffline';
import IsOnlineNotification from '../OnlineSearch/Notifications/IsOnlineNotification';
import { navigateOnRead } from './FunctionalLocationDetailsNav';

export default async function NavToFunctionalLocationDetails(context) {
    let pageProxy = context.getPageProxy();
    const actionContext = pageProxy.getActionBinding();
    const isHeaderFLOCAvailableOffline = await IsOnlineEntityAvailableOffline(pageProxy, 'MyFunctionalLocations', 'HeaderFunctionLocation');
    const isFLOCAvailableOffline = await IsOnlineEntityAvailableOffline(pageProxy, 'MyFunctionalLocations', 'FuncLocId');

    if (IsOnlineNotification(context) && isHeaderFLOCAvailableOffline) {
        return navigateOnRead(context, `MyFunctionalLocations('${context.binding.HeaderFunctionLocation}')`);
    }

    if (isFLOCAvailableOffline) {
        return navigateOnRead(context, `MyFunctionalLocations('${actionContext.FuncLocIdIntern}')`);
    }

    const queryOpts = '$expand=FuncLocSystemStatus,FuncLocUserStatus,FuncLocClass,FuncLocDocument,FuncLocPartner';
    return context.read('/SAPAssetManager/Services/OnlineAssetManager.service', actionContext['@odata.readLink'], [], queryOpts)
        .then(results => {
            pageProxy.setActionBinding(results.getItem(0));
            return context.executeAction('/SAPAssetManager/Actions/FunctionalLocation/OnlineFunctionalLocationDetailsNav.action');
        })
        .catch(error => {
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryOnlineFunctionalLocation.global').getValue(), error);
        });
}
