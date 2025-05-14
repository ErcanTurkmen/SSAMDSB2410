import IsOperationLevelAssigmentType from '../../WorkOrders/Operations/IsOperationLevelAssigmentType';
import WorkOrderDetailsNav from '../../WorkOrders/WorkOrderDetailsNav';
import WorkOrderOperationDetailsNav from '../../WorkOrders/Operations/Details/WorkOrderOperationDetailsNav';
import IsSubOperationLevelAssigmentType from '../../WorkOrders/SubOperations/IsSubOperationLevelAssigmentType';
import SubOperationDetailsNav from '../../SubOperations/SubOperationDetailsNav';
import IsFSMS4SectionVisible from '../../ServiceOrders/IsFSMS4SectionVisible';
import IsServiceOrderLevel from '../../ServiceOrders/IsServiceOrderLevel';
import ServiceOrderDetailsNav from '../../ServiceOrders/ListView/ServiceOrderDetailsNav';
import ServiceItemDetailsNav from '../../ServiceOrders/ServiceItems/ServiceItemDetailsNav';

//My Work Section Details Nav
export default function ObjectCardDetailsNav(context) {
    //FSM-S4 Enabled
    if (IsFSMS4SectionVisible(context)) {
        return IsServiceOrderLevel(context) ? ServiceOrderDetailsNav(context) : ServiceItemDetailsNav(context);
    } else {
        //My Operation Details Nav
        if (IsOperationLevelAssigmentType(context)) {
            return WorkOrderOperationDetailsNav(context);
        } else if (IsSubOperationLevelAssigmentType(context)) {
            return SubOperationDetailsNav(context);
        } else {
        //My Work Order Details Nav
            return WorkOrderDetailsNav(context);
        }
    }
}
