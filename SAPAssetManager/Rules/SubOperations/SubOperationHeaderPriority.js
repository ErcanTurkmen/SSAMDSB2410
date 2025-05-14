export default function SubOperationHeaderPriority(context) {
    return context.binding?.WorkOrderOperation?.WOHeader?.WOPriority?.PriorityDescription || '';
}
