import libForm from '../../Common/Library/FormatLibrary';
import { readDamageCode } from './NotificationDetailsItemListFormat';
import libVal from '../../Common/Library/ValidationLibrary';

export default function NotificationDetailsItemDamageCodeDataTable(context) {
    const binding = context.binding;
    return readDamageCode(context).then((result) => {
        return libVal.evalIsEmpty(result) ? '-' : libForm.getFormattedKeyDescriptionPair(context, binding?.DamageCode, result.getItem(0)?.CodeDescription);
    });
}
