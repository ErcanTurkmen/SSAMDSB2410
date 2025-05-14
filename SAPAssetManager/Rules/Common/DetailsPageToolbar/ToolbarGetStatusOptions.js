import { NotificationItemTaskChangeStatusOptions } from '../../Notifications/Details/NotificationItemTaskDetailsNav';
import { NotificationTaskChangeStatusOptions } from '../../Notifications/Details/NotificationTaskDetailsNav';
import NotificationChangeStatusOptions from '../../Notifications/MobileStatus/NotificationChangeStatusOptions';
import OperationChangeStatusOptions from '../../Operations/MobileStatus/OperationChangeStatusOptions';
import S4ServiceLibrary from '../../ServiceOrders/S4ServiceLibrary';
import SubOperationChangeStatusOptions from '../../SubOperations/SubOperationChangeStatusOptions';
import WorkOrderChangeStatusOptions from '../../WorkOrders/MobileStatus/WorkOrderChangeStatusOptions';

export default function ToolbarGetStatusOptions(context) {
    switch (context.binding['@odata.type']) {
        case '#sap_mobile.MyWorkOrderHeader':
            return WorkOrderChangeStatusOptions(context, context.binding, true);
        case '#sap_mobile.S4ServiceRequest':
            return S4ServiceLibrary.getAvailableStatusesServiceRequest(context, context.binding, true);
        case '#sap_mobile.S4ServiceOrder':
            return S4ServiceLibrary.getAvailableStatusesServiceOrder(context, context.binding, true);
        case '#sap_mobile.MyWorkOrderOperation':
            return OperationChangeStatusOptions(context, context.binding, true);
        case '#sap_mobile.MyWorkOrderSubOperation':
            return SubOperationChangeStatusOptions(context, context.binding, true);
        case '#sap_mobile.MyNotificationHeader':
            return NotificationChangeStatusOptions(context);
        case '#sap_mobile.S4ServiceItem':
            return S4ServiceLibrary.getAvailableStatusesServiceItem(context, context.binding, true);
        case '#sap_mobile.MyNotificationTask':
            return NotificationTaskChangeStatusOptions(context, context.binding);
        case '#sap_mobile.MyNotificationItemTask':
            return NotificationItemTaskChangeStatusOptions(context, context.binding);
        default:
            return Promise.resolve([]);
    }
}
