import FilterSettings from '../../../Filter/FilterSettings';
import Logger from '../../../Log/Logger';

export default function RouteListOnPageLoad(pageClientAPI) {
    FilterSettings.saveInitialFilterForPage(pageClientAPI);
    FilterSettings.applySavedFilterOnList(pageClientAPI);
    Logger.info(pageClientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryPrefs.global').getValue(), 'RouteListOnPageLoad called');
}
