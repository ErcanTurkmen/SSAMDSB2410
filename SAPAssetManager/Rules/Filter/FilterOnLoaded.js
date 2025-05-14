import Logger from '../Log/Logger';
import style from '../Common/Style/StyleFormCellButton';
import isAndroid from '../Common/IsAndroid';
import RedrawFilterToolbar from './RedrawFilterToolbar';

export default function FilterOnLoaded(pageClientAPI) {
    try {
        if (!isAndroid(pageClientAPI)) {
            style(pageClientAPI, 'ResetButton', 'FormCellButton');
        }
        RedrawFilterToolbar(pageClientAPI);
    } catch (exception) {
        /**Implementing our Logger class*/
        Logger.error('Filter', `FilterOnLoaded error: ${exception}`);
    }
}
