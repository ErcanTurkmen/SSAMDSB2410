/**
* Describe this function...
* @param {IClientAPI} context
*/
import Logger from '../Log/Logger';

export default function FetchVisualizationsFailure(context) {
    let result = context.getActionResult('epdResult').error;
    Logger.error('EPD', 'Fetch Visualizations failure, error = ' + JSON.stringify(result));
}
