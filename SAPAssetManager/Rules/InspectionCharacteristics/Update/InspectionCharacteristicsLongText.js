
export default function InspectionCharacteristicsLongText(context) {
    let binding = context.binding;

    if (binding && binding.MasterInspCharLongText_Nav && binding.MasterInspCharLongText_Nav.TextString) {
        return binding.MasterInspCharLongText_Nav.TextString;
    }

    return '-';
}
