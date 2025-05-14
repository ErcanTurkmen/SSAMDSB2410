import IsOperationLevelAssigmentType from '../../WorkOrders/Operations/IsOperationLevelAssigmentType';
import IsSubOperationLevelAssigmentType from '../../WorkOrders/SubOperations/IsSubOperationLevelAssigmentType';
import IsFSMS4SectionVisible from '../../ServiceOrders/IsFSMS4SectionVisible';
import IsServiceOrderLevel from '../../ServiceOrders/IsServiceOrderLevel';

//My Work Section Object Card Title
export default function ObjectCardTitle(context) {
    //FSM-S4 Enabled
    if (IsFSMS4SectionVisible(context)) {
        //Header Level
        if (IsServiceOrderLevel(context)) {
            if (context.binding.Description) {
                return context.binding.Description + ' - ' + context.binding.ObjectID;
            } else {
                return context.binding.ObjectID;
            }
        } else {
        //Item Level
            if (context.binding.ItemDesc) {
                return context.binding.ItemDesc;
            } else {
                return context.binding.ObjectID + ' - ' + context.binding.ItemNo;
            }
        }
    } else {
    //MT Enabled
        //My Operation Title
        if (IsOperationLevelAssigmentType(context)) {
            if (context.binding.OperationShortText) {
                return context.binding.OperationShortText + ' - ' + context.binding.OperationNo;
            } else {
                return context.binding.OperationNo || '-';
            }
        } else if (IsSubOperationLevelAssigmentType(context)) {
        //SupOpertaion Title
            if (context.binding.OperationShortText) {
                return context.binding.OperationShortText + ' - ' + context.binding.SubOperationNo;
            } else {
                return context.binding.SubOperationNo || '-';
            }
        } else {
        //My Work Order Title
            if (context.binding.OrderDescription) {
                return context.binding.OrderDescription + ' - ' + context.binding.OrderId;
            } else {
                return context.binding.OrderId || '-';
            }
        }
    }

}
