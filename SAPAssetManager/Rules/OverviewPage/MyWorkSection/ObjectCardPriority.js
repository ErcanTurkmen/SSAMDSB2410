import IsOperationLevelAssigmentType from '../../WorkOrders/Operations/IsOperationLevelAssigmentType';
import IsSubOperationLevelAssigmentType from '../../WorkOrders/SubOperations/IsSubOperationLevelAssigmentType';
import IsFSMS4SectionVisible from '../../ServiceOrders/IsFSMS4SectionVisible';
import IsServiceOrderLevel from '../../ServiceOrders/IsServiceOrderLevel';
import ServiceItemTypeText from '../../ServiceOrders/ServiceItems/ServiceItemTypeText';

//My Work Section Object Card Priority
export default function ObjectCardPriority(context) {
    //FSM-S4 Enabled
    if (IsFSMS4SectionVisible(context)) {
        //Header Level
        if (IsServiceOrderLevel(context)) {
            if (context.binding.Priority_Nav) {
                return context.binding.Priority_Nav.Description;
            } else {
                return '-';
            }
        } else {
        //Item Level
            return ServiceItemTypeText(context);
        }
    } else {
        //My Operation OrderId since operations don't have priorities
        if (IsOperationLevelAssigmentType(context)) {
            return context.binding.OrderId;
        } else if (IsSubOperationLevelAssigmentType(context)) {
            //SupOpertaion Mobile Status
            return context.binding.OrderId + ' - ' + context.binding.OperationNo;
        } else {
            //My Work Order Priority
            return context.binding.WOPriority.PriorityDescription;
        }
    }
}
