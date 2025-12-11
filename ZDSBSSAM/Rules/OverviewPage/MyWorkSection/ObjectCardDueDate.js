import IsOperationLevelAssigmentType from '../../../../SAPAssetManager/Rules/WorkOrders/Operations/IsOperationLevelAssigmentType';
import WorkOrderDueDate from '../../../../SAPAssetManager/Rules/WorkOrders/Operations/WorkOrderDueDate';
import DueDate from '../../../../SAPAssetManager/Rules/DateTime/DueDate';
import IsSubOperationLevelAssigmentType from '../../../../SAPAssetManager/Rules/WorkOrders/SubOperations/IsSubOperationLevelAssigmentType';
import IsFSMS4SectionVisible from '../../../../SAPAssetManager/Rules/ServiceOrders/IsFSMS4SectionVisible';
import ServiceDueByDate from '../../../../SAPAssetManager/Rules/DateTime/ServiceDueByDate';

//My Work Section Object Card Due Date
export default function ObjectCardDueDate(context) {
    //FSM-S4 Enabled
    if (IsFSMS4SectionVisible(context)) {
        //Header Level
        return ServiceDueByDate(context);
    } else {
        //My Operation DueDate
        if (IsOperationLevelAssigmentType(context) || IsSubOperationLevelAssigmentType(context)) {
            //DSB customization to show functional location id
            return context.binding.WOHeader?.HeaderFunctionLocation;    //WorkOrderDueDate(context);
        } else {
            //My Work Order DueDate
            return DueDate(context);
        }
    }
}
