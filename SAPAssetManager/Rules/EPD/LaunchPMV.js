/**
* Describe this function...
* @param {IClientAPI} context
*/
import Logger from '../Log/Logger';
import NetworkLib from '../Common/Library/NetworkMonitoringLibrary';
import URLModuleLibrary from '../../Extensions/URLModule/URLModuleLibrary';

export default function LaunchPMV(context) {
    if (NetworkLib.isNetworkConnected(context)) {
        let visualization = context.getPageProxy().getClientData().Visualization;
        if (visualization) {
            let sceneId = visualization.sceneId;
            let title = '';
            let entityType = context.getPageProxy().binding['@odata.type'];
            if (entityType === '#sap_mobile.MyFunctionalLocation') {
                title = context.getPageProxy().binding.FuncLocId;
            } else if (entityType === '#sap_mobile.MyEquipment') {
                title = context.getPageProxy().binding.EquipId;
            }
            let url = context.getGlobalDefinition('/SAPAssetManager/Globals/EPD/PMVDeepLink.global').getValue() +
                        'sceneId=' + sceneId + '&title=' + title;
            Logger.debug('EPD', 'deep link url = ' + url);
            let canOpen =  URLModuleLibrary.openUrl(url);
            if (!canOpen) {
                // show alert
                context.executeAction('/SAPAssetManager/Actions/EPD/PMVAppNotFound.action');
            }
            return canOpen;
        }
    } else {
        // show alert
        context.executeAction('/SAPAssetManager/Actions/EPD/NoNetworkConnection.action');
    }
}
