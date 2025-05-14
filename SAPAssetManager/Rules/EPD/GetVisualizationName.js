/**
* Describe this function...
* @param {IClientAPI} context
*/
import EPDVisLib from './EPDVisualizationLibrary';

export default function GetVisualizationName(context) {
    return EPDVisLib.IsVisualizationAvailable(context.getPageProxy()).then(enabled => {
        if (enabled) {
            let vis = EPDVisLib.GetVisualization(context.getPageProxy());
            if (vis) {
                return vis.name;
            }
        }
        return context.localizeText('view_model');
    }, () => {
        return context.localizeText('view_model');
    });
}
