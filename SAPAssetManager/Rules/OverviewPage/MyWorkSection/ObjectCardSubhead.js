import IsOperationLevelAssigmentType from '../../WorkOrders/Operations/IsOperationLevelAssigmentType';
import { WorkOrderEventLibrary } from '../../WorkOrders/WorkOrderLibrary';
import IsSubOperationLevelAssigmentType from '../../WorkOrders/SubOperations/IsSubOperationLevelAssigmentType';
import SubOperationMobileStatus from '../../MobileStatus/SubOperationMobileStatus';
import IsFSMS4SectionVisible from '../../ServiceOrders/IsFSMS4SectionVisible';
import IsServiceOrderLevel from '../../ServiceOrders/IsServiceOrderLevel';
import ServiceItemStatusText from '../../ServiceOrders/ServiceItems/ServiceItemStatusText';

//My Work Section Object Card Subhead
export default function ObjectCardSubhead(context) {
    //FSM-S4 Enabled
    if (IsFSMS4SectionVisible(context)) {
        //Header Level
        if (IsServiceOrderLevel(context)) {
            return WorkOrderEventLibrary.getWorkOrderMobileStatusText(context);
        } else {
        //Item Level
            return ServiceItemStatusText(context);
        }
    } else {
        if (IsOperationLevelAssigmentType(context)) {
            return WorkOrderEventLibrary.getWorkOrderOperationMobileStatusText(context);
        } else if (IsSubOperationLevelAssigmentType(context)) {
            //SupOpertaion Mobile Status
            return SubOperationMobileStatus(context);
        } else {
            return WorkOrderEventLibrary.getWorkOrderMobileStatusText(context);
        }
    }
}
