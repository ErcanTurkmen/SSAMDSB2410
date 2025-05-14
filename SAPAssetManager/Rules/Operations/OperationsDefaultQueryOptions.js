import { OperationLibrary as libOperations } from '../WorkOrders/Operations/WorkOrderOperationLibrary';

export default function OperationsDefaultQueryOptions(context) {
    return libOperations.attachOperationsFilterByAssgnTypeOrWCM(context);
}
