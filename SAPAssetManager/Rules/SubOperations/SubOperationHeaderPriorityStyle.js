import { GetPriorityColor } from '../Priority/WOPriorityStatusStyle';

export default function SubOperationHeaderPriorityStyle(context) {
    return GetPriorityColor(context.binding?.WorkOrderOperation?.WOHeader?.WOPriority?.Priority) || '';
}
