import notificationReferenceNumber from './NotificationReferenceNumber';
import { WorkOrderLibrary as libWorkOrder } from '../../WorkOrders/WorkOrderLibrary';

export default function NotificationReferenceType(context) {
    if (notificationReferenceNumber(context)) { //Check for follow-on orderId
        return libWorkOrder.isServiceOrder(context).then((isService) => {
            if (isService) {
                return context.getGlobalDefinition('/SAPAssetManager/Globals/Notifications/FollowOnServiceOrderType.global').getValue();
            } else {
                return context.getGlobalDefinition('/SAPAssetManager/Globals/Notifications/FollowOnWorkOrderType.global').getValue();
            }
        });
    } else {
        return Promise.resolve(''); //This is not a follow-on notif
    }
}
