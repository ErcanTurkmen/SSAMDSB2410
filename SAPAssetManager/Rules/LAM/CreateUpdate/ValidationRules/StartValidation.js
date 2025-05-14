import CommonLibrary from '../../../Common/Library/CommonLibrary';
import libVal from '../../../Common/Library/ValidationLibrary';

export default function StartValidation(context, control, start, length_field) {
    if (libVal.evalIsEmpty(start) && length_field) {
        let message = context.localizeText('start_point_is_required');
        CommonLibrary.executeInlineControlError(context, control, message);
    } else {
        CommonLibrary.clearValidationOnInput(control);
    }
}
