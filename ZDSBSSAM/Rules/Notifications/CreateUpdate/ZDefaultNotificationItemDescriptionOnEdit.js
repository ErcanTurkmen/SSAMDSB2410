import libForm from '../../../../SAPAssetManager/Rules/Common/Library/FormatLibrary';

export default function ZDefaultNotificationItemDescriptionOnEdit(context) {
    const binding = context.binding;
    return libForm.getFormattedKeyDescriptionPair(context, binding?.ItemNumber, binding?.ItemText);
}
