import isWindows from '../Common/IsWindows';
import OperationLevelAssigmentType from '../WorkOrders/Operations/IsOperationLevelAssigmentType';
export default function OpLevelAssigmentType(context) {
    return (OperationLevelAssigmentType(context) && isWindows(context));
}
