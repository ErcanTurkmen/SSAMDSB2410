import EquipmentDetailsNav from '../../Equipment/EquipmentDetailsNav';
import { navigateOnRead } from '../../FunctionalLocation/FunctionalLocationDetailsNav';
import { readAndNavigateToOfflineNotification } from '../../Notifications/OnlineDetails/NavToNotificationOnlineDetailsPage';
import WorkOrderDetailsNav from '../../WorkOrders/WorkOrderDetailsNav';

export default function NavigateToOfflineDetails(context) {
    return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
        if (context.binding['@odata.type'] === '#sap_mobile.Equipment') {
            return EquipmentDetailsNav(context);
        } else if (context.binding['@odata.type'] === '#sap_mobile.NotificationHeader') {
            return readAndNavigateToOfflineNotification(context.getPageProxy(), context.binding.NotificationNumber);
        } else if (context.binding['@odata.type'] === '#sap_mobile.WorkOrderHeader') {
            return WorkOrderDetailsNav(context.getPageProxy(), true);
        }

        return navigateOnRead(context, `MyFunctionalLocations('${context.binding.FuncLocIdIntern}')`);
    });
}
