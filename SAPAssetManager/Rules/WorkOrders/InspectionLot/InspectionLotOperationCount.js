import CommonLibrary from '../../Common/Library/CommonLibrary';
import { OperationLibrary as libOperations } from '../Operations/WorkOrderOperationLibrary';

export default function InspectionLotOperationCount(context) {
    return CommonLibrary.getEntitySetCount(context, 'MyWorkOrderOperations', libOperations.attachOperationsFilterByAssgnTypeOrWCM(context, "$filter=OrderId eq '" + context.getPageProxy().getBindingObject().OrderId + "' and sap.entityexists(InspectionPoint_Nav)"));
}
