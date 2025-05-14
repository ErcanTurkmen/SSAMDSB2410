import ExecuteNavToOnlineSearchPage from '../ExecuteNavToOnlineSearchPage';

/**
* Navigates to Online Search page with 'Notifications' tab preselected
* @param {IClientAPI} context
*/
export default function OnlineSearchFromNotificationsNav(context) {
    const notificationsTabName = context.getGlobalDefinition('/SAPAssetManager/Globals/OnlineSearch/NotificationsTab.global').getValue();
    return ExecuteNavToOnlineSearchPage(context, notificationsTabName);

}
