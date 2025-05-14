import IsSubOperationLevelAssigmentType from '../../WorkOrders/SubOperations/IsSubOperationLevelAssigmentType';
import IsNotWCMOperator from '../../WCM/IsNotWCMOperator';

export default function ObjectCardPartVisible(context) {
    if (IsSubOperationLevelAssigmentType(context)) {
        return false;
    }
    return IsNotWCMOperator(context);
}
