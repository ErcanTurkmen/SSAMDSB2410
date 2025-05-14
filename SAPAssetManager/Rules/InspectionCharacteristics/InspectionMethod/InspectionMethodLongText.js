export default function InspectionMethodLongText(context) {
    let binding = context._context.binding.MethodLongText_Nav || context.binding.InspectionMethod_Nav;

    try {
        if (binding && binding.LongTextFlag === 'X') {
            return binding.MethodLongText_Nav.TextString;
        } else {
            return binding.TextString;
        }
    } catch (err) {
        return '-';
    }
}
