import libCom from '../../../Common/Library/CommonLibrary';
import { OperationLibrary as libOperations } from '../../Operations/WorkOrderOperationLibrary';

export default function OperationsCount(context) {
    return libCom.getEntitySetCount(context, 'MyWorkOrderOperations', libOperations.attachOperationsFilterByAssgnTypeOrWCM(context, "$filter=OrderId eq '" + context.binding.OrderId + "' and sap.entityexists(InspectionPoint_Nav)"));
}
