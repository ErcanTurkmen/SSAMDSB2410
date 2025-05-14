
export default function MandatoryStatusStyle(context) {
    let style = '';
    let binding = context.binding;

    if (binding && context.binding.Mandatory) {
        style = 'ResetRed';
    }

    return style;
}
