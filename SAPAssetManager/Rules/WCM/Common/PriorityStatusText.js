import GetPriorityDescription from './GetPriorityDescription';

export default function PriorityStatusText(context) {
    let priority = context.binding.Priority;
    return priority ? GetPriorityDescription(context, priority) : '';
}
