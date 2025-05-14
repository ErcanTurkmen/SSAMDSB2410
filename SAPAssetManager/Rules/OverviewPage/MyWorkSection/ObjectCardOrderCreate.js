import IsOperationLevelAssigmentType from '../../WorkOrders/Operations/IsOperationLevelAssigmentType';
import FollowUpWorkOrderCreateNav from '../../WorkOrders/FollowUpWorkOrderCreateNav';
import WorkOrderCreateNav from '../../WorkOrders/CreateUpdate/WorkOrderCreateNav';

export default function ObjectCardOrderCreate(context) {
    if (IsOperationLevelAssigmentType(context)) {
        return WorkOrderCreateNav(context);
    } else {
        return FollowUpWorkOrderCreateNav(context);
    }
}
