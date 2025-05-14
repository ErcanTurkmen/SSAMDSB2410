import FollowOnWorkOrderListViewCaption from '../FollowOnWorkOrderListViewCaption';
import Logger from '../../Log/Logger';
import libCom from '../../Common/Library/CommonLibrary';
import FilterSettings from '../../Filter/FilterSettings';

export default async function FollowOnWorkOrderListViewOnPageLoad(pageClientAPI) {
    FilterSettings.saveInitialFilterForPage(pageClientAPI);
    FilterSettings.applySavedFilterOnList(pageClientAPI);
    let caption = await FollowOnWorkOrderListViewCaption(pageClientAPI);
    pageClientAPI.setCaption(caption);
    Logger.info(pageClientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryPrefs.global').getValue(), 'WorkOrderListViewOnPageLoad called');
    libCom.removeStateVariable(pageClientAPI, 'SupervisorAssignmentFilter');
}
