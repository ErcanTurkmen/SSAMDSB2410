import Logger from '../../Log/Logger';
import WOListCaption from '../WorkOrderListViewCaption';
import libCom from '../../Common/Library/CommonLibrary';
import FilterSettings from '../../Filter/FilterSettings';

export default async function WorkOrderListViewOnPageLoad(pageClientAPI) {
    FilterSettings.saveInitialFilterForPage(pageClientAPI);
    FilterSettings.applySavedFilterOnList(pageClientAPI);
    let MyWorkOrderListView = libCom.getStateVariable(pageClientAPI, 'MyWorkOrderListView');
    if (MyWorkOrderListView === true) {
        libCom.removeStateVariable(pageClientAPI, 'MyWorkOrderListView');
        return;
    }
    let caption = await WOListCaption(pageClientAPI);
    pageClientAPI.setCaption(caption);
    Logger.info(pageClientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryPrefs.global').getValue(), 'WorkOrderListViewOnPageLoad called');
    libCom.removeStateVariable(pageClientAPI, 'SupervisorAssignmentFilter');
}
