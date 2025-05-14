import CommonLibrary from '../Common/Library/CommonLibrary';
import { OperationLibrary as libOperations } from '../WorkOrders/Operations/WorkOrderOperationLibrary';

export default function WorkOrderOperationsCount(context, queryOption = '') {
    return CommonLibrary.getEntitySetCount(context, 'MyWorkOrderOperations', libOperations.attachOperationsFilterByAssgnTypeOrWCM(context, queryOption));
}
