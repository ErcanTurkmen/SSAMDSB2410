import IsOperationLevelAssigmentType from '../../WorkOrders/Operations/IsOperationLevelAssigmentType';
import WorkOrderDueDate from '../../WorkOrders/Operations/WorkOrderDueDate';
import DueDate from '../../DateTime/DueDate';
import IsSubOperationLevelAssigmentType from '../../WorkOrders/SubOperations/IsSubOperationLevelAssigmentType';
import IsFSMS4SectionVisible from '../../ServiceOrders/IsFSMS4SectionVisible';
import ServiceDueByDate from '../../DateTime/ServiceDueByDate';

//My Work Section Object Card Due Date
export default function ObjectCardDueDate(context) {
    //FSM-S4 Enabled
    if (IsFSMS4SectionVisible(context)) {
        //Header Level
        return ServiceDueByDate(context);
    } else {
        //My Operation DueDate
        if (IsOperationLevelAssigmentType(context) || IsSubOperationLevelAssigmentType(context)) {
            return WorkOrderDueDate(context);
        } else {
            //My Work Order DueDate
            return DueDate(context);
        }
    }
}
