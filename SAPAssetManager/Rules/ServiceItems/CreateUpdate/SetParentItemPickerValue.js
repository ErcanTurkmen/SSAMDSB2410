export default function SetParentItemPickerValue(context) {
    const binding = context.binding || {};

    if (binding.HigherLvlItem) {
        return binding.HigherLvlItem.toString().padStart(6, '0');
    }

    return '';
}
