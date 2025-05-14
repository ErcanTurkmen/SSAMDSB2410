import libForm from '../../Common/Library/FormatLibrary';
import { readPartCode } from './NotificationDetailsItemListFormat';
import libVal from '../../Common/Library/ValidationLibrary';

export default function NotificationDetailsItemPartCodeDataTable(context) {
    const binding = context.binding;
    return readPartCode(context).then((result) => {
        return libVal.evalIsEmpty(result) ? '-' : libForm.getFormattedKeyDescriptionPair(context, binding.ObjectPart, result.getItem(0).CodeDescription);
    });
}
