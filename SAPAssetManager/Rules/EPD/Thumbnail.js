/**
* Describe this function...
* @param {IClientAPI} context
*/
import Logger from '../Log/Logger';
import EPDVisLib from './EPDVisualizationLibrary';

export default function Thumbnail(context) {
    let endpoint = context.getAppClientData().MobileServiceEndpoint;
    let service = context.getPageDefinition('/SAPAssetManager/Services/EPDRest.service');
    let destination = service.DestinationName;
    let url = `${endpoint}/${destination}/`;

    let thumbnail = '';
    return EPDVisLib.IsVisualizationAvailable(context.getPageProxy()).then(enabled => {
        if (enabled) {
            let vis = EPDVisLib.GetVisualization(context.getPageProxy());
            if (vis) {
                thumbnail = url + vis.thumbnailUrl;
            }
        }
        Logger.debug('EPD', 'thumbnail url = ' + thumbnail);
        return thumbnail;
    });
}
