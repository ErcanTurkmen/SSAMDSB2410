import filterLib from '../Filter/FilterLibrary';
import Logger from '../Log/Logger';
import CommonLib from '../Common/Library/CommonLibrary';

export default function FilterDone(pageClientAPI) {
    try {
        let count = filterLib.getFilterCount(pageClientAPI);
        let previousPage = pageClientAPI.evaluateTargetPathForAPI('#Page:-Previous');
        CommonLib.setStateVariable(pageClientAPI, 'filterCount', count, CommonLib.getPageName(previousPage));
        if (count > 0 && !filterLib.isDefaultFilter(pageClientAPI)) {
            previousPage.getPressedItem().getActionItem().text = pageClientAPI.localizeText('filter_count', [count]);
        } else {
            previousPage.getPressedItem().getActionItem().text = pageClientAPI.localizeText('filter');
        }
    } catch (exception) {
        /**Implementing our Logger class*/
        Logger.error('Filter', `FilterUpdateCount error: ${exception}`);
    }
    return pageClientAPI.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
}
