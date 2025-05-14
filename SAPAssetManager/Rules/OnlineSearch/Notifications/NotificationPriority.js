export default function NotificationPriority(context) {
    const binding = context.getBindingObject();
    return binding.PriorityDesc ?? context.localizeText('none');
}
