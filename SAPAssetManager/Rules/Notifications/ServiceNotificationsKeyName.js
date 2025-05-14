/**
* Describe this function...
* @param {IClientAPI} context
*/
import IsS4SidePanelEnabled from '../SideDrawer/IsS4SidePanelEnabled';

export default function ServiceNotificationsKeyName(context) {
    if (IsS4SidePanelEnabled(context)) {
        return context.localizeText('service_requests');
    }
    return context.localizeText('service_notifications');
}
