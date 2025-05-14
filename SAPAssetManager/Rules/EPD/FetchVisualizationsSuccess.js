/**
* Describe this function...
* @param {IClientAPI} context
*/
import libVis from './EPDVisualizationLibrary';
import Logger from '../Log/Logger';

export default function FetchVisualizationsSuccess(context) {
    Logger.debug('EPD', 'Fetch Visualizations successful');
    let result = context.getActionResult('epdResult').data;
    return libVis.SaveVisualizations(context, result);
}
