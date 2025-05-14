import libThis from './ODataLibrary';
import Logger from '../Log/Logger';

export default class {

    static isOnlineService(context) {
        let provider = context.getODataProvider('/SAPAssetManager/Services/OnlineAssetManager.service');
        return provider.isInitialized();
    }

    static async initializeOnlineService(context) {
        if (libThis.isOnlineService(context)) {
            return Promise.resolve(true);
        }
        return context.executeAction('/SAPAssetManager/Actions/OData/OpenOnlineService.action').then(() => {
            return true;
        }).catch((error) => {
            Logger.error('initializeOnlineService', error);
            return false;
        });
    }
}
