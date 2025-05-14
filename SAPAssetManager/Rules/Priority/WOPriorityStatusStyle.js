
export default function WOPriorityStatusStyle(context) {

    let binding = context.getBindingObject();

    if (binding && binding.WOPriority && (binding.WOPriority.Priority || binding.WOPriority.PriorityDescription)) {
        return GetPriorityColor(binding.WOPriority.Priority || binding.WOPriority.PriorityDescription);
    }

    if (binding && binding.Priority) {
        return GetPriorityColor(binding.Priority);
    }

    return 'GrayText';
}

export const PriorityEnum = Object.freeze({
    veryHighPriority: '1',
    highPriority: '2',
    mediumPriority: '3',
    emergencyPriority: '*',
});

export function GetPriorityColor(priority) {
    return {
        [PriorityEnum.emergencyPriority]: 'HighPriorityRed',
        [PriorityEnum.veryHighPriority]: 'HighPriorityRed',
        [PriorityEnum.highPriority]: 'HighPriorityRed',
        [PriorityEnum.mediumPriority]: 'MediumPriorityOrange',
    }[priority] || 'GrayText';
}
