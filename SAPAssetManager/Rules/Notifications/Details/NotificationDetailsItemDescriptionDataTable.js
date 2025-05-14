import libForm from '../../Common/Library/FormatLibrary';

export default function NotificationDetailsItemDescriptionDataTable(context) {
    const binding = context.binding;
    return libForm.getFormattedKeyDescriptionPair(context, binding?.ItemNumber, binding?.ItemText);
}
