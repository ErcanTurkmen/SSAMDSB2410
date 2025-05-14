import { GetPriorityColor } from '../Priority/WOPriorityStatusStyle';

/** @param {IPageProxy & {binding: MyWorkOrderOperation}} context  */
export default function OperationHeaderPriorityColor(context) {
    return GetPriorityColor(context.binding.WOHeader?.WOPriority?.Priority || context.binding.Header?.Priority) || '';
}
