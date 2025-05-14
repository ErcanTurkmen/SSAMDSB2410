export default function NotificationPriorityStatusStyle(context) {

    const binding = context.getBindingObject();
    const priority = binding.NotifPriority || binding.Priority;
    const priorityDesc = binding.NotifPriority?.PriorityDescription || binding.HistoryPriority_Nav?.PriorityDescription || binding.PriorityDesc;

    if (binding && priority && priorityDesc) {
        let veryHighPriority = '1-Very high';
        let highPriority = '2-High';
        let mediumPriority = '3-Medium';
        let emergencyPriority = '* Emergency';

        switch (priorityDesc) {
            case veryHighPriority:
            case highPriority:
            case emergencyPriority:
                return 'HighPriorityRed';
            case mediumPriority:
                return 'MediumPriorityOrange';
            default:
                return 'GrayText';
        }
    }

    return 'GrayText';
}
