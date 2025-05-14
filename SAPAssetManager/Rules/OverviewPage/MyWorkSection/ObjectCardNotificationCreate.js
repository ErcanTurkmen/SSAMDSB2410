import IsOperationLevelAssigmentType from '../../WorkOrders/Operations/IsOperationLevelAssigmentType';
import WorkOrderNotificationCreateNav from '../../WorkOrders/WorkOrderNotificationCreateNav';
import WorkOrderOperationNotificationCreateNav from '../../Operations/WorkOrderOperationNotificationCreateNav';
import IsSubOperationLevelAssigmentType from '../../WorkOrders/SubOperations/IsSubOperationLevelAssigmentType';
import SubOperationNotificationCreateNav from '../../SubOperations/SubOperationNotificationCreateNav';

export default function ObjectCardNotificationCreate(context) {
    if (IsOperationLevelAssigmentType(context)) {
        return WorkOrderOperationNotificationCreateNav(context);
    } else if (IsSubOperationLevelAssigmentType(context)) {
        return SubOperationNotificationCreateNav(context);
    } else {
        return WorkOrderNotificationCreateNav(context);
    }
}
