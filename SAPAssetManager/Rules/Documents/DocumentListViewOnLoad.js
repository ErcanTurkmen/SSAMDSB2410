import libDocument from './DocumentLibrary';
import libWOStatus from '../WorkOrders/MobileStatus/WorkOrderMobileStatusLibrary';
import libNotifStatus from '../Notifications/MobileStatus/NotificationMobileStatusLibrary';
import setCaption from './DocumentListViewCaption';
import FilterSettings from '../Filter/FilterSettings';

export default function DocumentListViewOnLoad(context) {
    FilterSettings.saveInitialFilterForPage(context);
    FilterSettings.applySavedFilterOnList(context);
    setCaption(context);
    switch (libDocument.getParentObjectType(context)) {
        case libDocument.ParentObjectType.WorkOrder:
            return libWOStatus.isOrderComplete(context).then(status => {
                if (status) {
                    context.setActionBarItemVisible(1, false);
                }
            });
        case libDocument.ParentObjectType.Notification:
            return libNotifStatus.isNotificationComplete(context).then(status => {
                if (status) {
                    context.setActionBarItemVisible(1, false);               
                }
            });
        case libDocument.ParentObjectType.MaterialDocument:
            return context.setActionBarItemVisible(1, false); 
        default:
            break;
    }   
}
