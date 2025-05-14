import libVal from '../../Common/Library/ValidationLibrary';
import {ValueIfExists} from '../../Common/Library/Formatter';

export default function ConfirmationDetailsNotes(context) {
    let longText = context.binding.LongText;
    context.getPageProxy()._context.binding = context.binding; // update the binding for the page with same read link
    if (!libVal.evalIsEmpty(longText)) {
        return ValueIfExists(longText[0].TextString);
    }
    return '-';
}
