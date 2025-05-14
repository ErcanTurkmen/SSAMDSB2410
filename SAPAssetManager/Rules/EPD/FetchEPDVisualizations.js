/**
* Describe this function...
* @param {IClientAPI} context
*/
import Logger from '../Log/Logger';
import EPDVisLib from './EPDVisualizationLibrary';
import NetworkLib from '../Common/Library/NetworkMonitoringLibrary';
import libCom from '../Common/Library/CommonLibrary';

export default function FetchEPDVisualizations(context) {
    if (EPDVisLib.IsEPDVisualizationEnabled(context)) {
        // if initial sync, clear the User preference entry to start fresh. 
        // We do this since UserPreferences table could be stale from previous sync
        if (libCom.isInitialSync(context)) {
            EPDVisLib.RemoveVisualizations(context).then(() => {
                return FetchVisualizations(context);
            });
        } else {
            // delta sync
            return FetchVisualizations(context);
        }
    } else {
        Logger.debug('EPD', 'EPD Visualization feature not enabled');
        return Promise.resolve(false);
    }
}

export function FetchVisualizations(context) {
    if (NetworkLib.isNetworkConnected(context)) {
        Logger.debug('EPD', 'Fetching EPD Visualizations');
        return context.executeAction('/SAPAssetManager/Actions/EPD/FetchVisualizationsWithRest.action').then(() => {
            return Promise.resolve(true);
        }, () => {
            return Promise.resolve(false);
        });
    }
    Logger.debug('EPD', 'No network connection');
    return Promise.resolve(false);
}
