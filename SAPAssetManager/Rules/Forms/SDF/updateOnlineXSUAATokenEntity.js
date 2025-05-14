import Logger from '../../Log/Logger';
import ApplicationSettings from '../../Common/Library/ApplicationSettings';
import getXSUAAToken from './GetXSUAAToken';
import ODataLibrary from '../../OData/ODataLibrary';

/**
 * 
 * @param {IClientAPI} context 
 * @param {string} xsuaaToken 
 * @returns {boolean} true if successful
 */
export default function updateOnlineXSUAATokenEntity(context, xsuaaToken) {
    return ODataLibrary.initializeOnlineService(context).then(function(flag) {
        if (!flag) {
            return context.count('/SAPAssetManager/Services/OnlineAssetManager.service', 'InventoryObjects', [], '').then(() => {
                // dont care about the result for now, this is a workaround for the online api to get the CSRF token
                return updateToken(context, xsuaaToken);
            });
        }
        return updateToken(context, xsuaaToken);
    }).catch(function(err) {
        // Could not open online service
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategorySAPDynamicForms.global').getValue(), `Failed to open Online OData Service: ${err}`);
        return false;
    });
}

/**
 * 
 * @param {IClientAPI} context 
 * @param {string} xsuaaToken 
 * @returns {boolean} true if successful
 */
function updateToken(context, xsuaaToken) {
    if (xsuaaToken) {
        ApplicationSettings.setString(context, 'SDF_XSUAA_TOKEN', xsuaaToken);
        return setXSUAAToken(context);
    }
    return getXSUAAToken(context).then((accessToken) => {
        if (accessToken) {
            const segmentCount = accessToken.split('.').length;
            if (segmentCount !== 3) {
                Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategorySAPDynamicForms.global').getValue(), `access token has ${segmentCount} segments while expecting 3`);
                return false;
            }
            ApplicationSettings.setString(context, 'SDF_XSUAA_TOKEN', accessToken);
            return setXSUAAToken(context);
        }
        return false;
    }).catch(function(err) {
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategorySAPDynamicForms.global').getValue(), `Failed to complete the online read: ${err}`);
        return false;
    });
}

function setXSUAAToken(context) {
    return context.executeAction('/SAPAssetManager/Actions/Forms/SDF/XSUAATokenUpdate.action').then(() => {
        Logger.info(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategorySAPDynamicForms.global').getValue(), 'Token update successful');
        return true;
    }).catch(function(err) {
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategorySAPDynamicForms.global').getValue(), `Failed to complete the online write: ${err}`);
        return false;
    });
}
