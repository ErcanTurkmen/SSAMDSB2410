
/** @param {IPageProxy & {binding: MyWorkOrderOperation}} context  */
export default function OperationHeaderPriority(context) {
    return context.binding.WOHeader?.WOPriority?.PriorityDescription || context.binding.Header?.PriorityDescription || '';
}
