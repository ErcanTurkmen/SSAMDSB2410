import libCommon from '../Common/Library/CommonLibrary';
import { ValueIfExists } from '../Common/Library/Formatter';

export default function S4RelatedHistoryNotes(context) {
    let historyLongText = context.binding.LongText_Nav;
    if (libCommon.isDefined(historyLongText)) {
        return ValueIfExists(historyLongText.TextString);
    } else {
        return '-';
    }
}
