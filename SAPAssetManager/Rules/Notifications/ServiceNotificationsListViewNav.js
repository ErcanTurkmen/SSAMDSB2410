/**
* Describe this function...
* @param {IClientAPI} context
*/
import IsS4SidePanelEnabled from '../SideDrawer/IsS4SidePanelEnabled';

export default function ServiceNotificationsListViewNav(context) {
    if (IsS4SidePanelEnabled(context)) {
        return context.executeAction('/SAPAssetManager/Actions/ServiceOrders/ServiceRequestsListViewNav.action');
    }
    return context.executeAction('/SAPAssetManager/Actions/Notifications/NotificationsListViewNav.action');
}
