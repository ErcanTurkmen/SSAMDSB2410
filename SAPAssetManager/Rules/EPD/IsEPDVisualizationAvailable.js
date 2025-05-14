/**
* Describe this function...
* @param {IClientAPI} context
*/
import EPDVisLib from './EPDVisualizationLibrary';

export default function IsEPDVisualizationAvailable(context) {
    return EPDVisLib.IsVisualizationAvailable(context.getPageProxy());      
}
