import Logger from '../Log/Logger';
import ODataLibrary from '../OData/ODataLibrary';

export default function TokenRequest(context) {
    return ODataLibrary.initializeOnlineService(context)
        .then(() => {
            return getAuthToken(context);
        }).catch(error => {
            Logger.error(`Failed to open Online OData Service: ${error}`);
            return null;
        });
}

function getAuthToken(context) {
    return context.read('/SAPAssetManager/Services/OnlineAssetManager.service', 'OauthTokens', [], '$filter=ParameterGroup eq \'EXTERNALCONNECTIONS\'')
        .then(result => {
            if (result && result.getItem(0) && result.getItem(0).OauthToken) {
                let item = result.getItem(0);
                let obj = {};
                obj.access_token = item.OauthToken;
                obj.expires_in = item.ExpiresIn;

                return obj;
            }
            Logger.error('Failed to retrieve a valid token');
            return null;
        }).catch(error => {
            Logger.error(`Failed to complete the online read: ${error}`);
            return null;
        });
}
