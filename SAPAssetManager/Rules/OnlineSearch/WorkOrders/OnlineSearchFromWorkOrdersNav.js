import ExecuteNavToOnlineSearchPage from '../ExecuteNavToOnlineSearchPage';

/**
* Navigates to Online Search page with 'Work Orders' tab preselected
* @param {IClientAPI} context
*/
export default function OnlineSearchFromWorkOrdersNav(context) {
    const workOrdersTabName = context.getGlobalDefinition('/SAPAssetManager/Globals/OnlineSearch/WorkOrdersTab.global').getValue();
    return ExecuteNavToOnlineSearchPage(context, workOrdersTabName);
}
