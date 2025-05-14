
export default function S4PriorityStatusStyle(context) {
    let binding = context.getBindingObject();
    if (binding && binding.Priority) {
        return GetPriorityColor(binding.Priority);
    }

    return 'GrayText';
}

export const PriorityEnum = Object.freeze({
    veryHighPriority: '1',
    highPriority: '3',
    mediumPriority: '5',
});

export function GetPriorityColor(priority) {
    return {
        [PriorityEnum.veryHighPriority]: 'HighPriorityRed',
        [PriorityEnum.highPriority]: 'HighPriorityRed',
        [PriorityEnum.mediumPriority]: 'MediumPriorityOrange',
    }[priority] || 'GrayText';
}
