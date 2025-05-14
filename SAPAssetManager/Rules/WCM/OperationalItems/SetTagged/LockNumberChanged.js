import CommonLibrary from '../../../Common/Library/CommonLibrary';
import { FieldMaxLengths } from './ValidateSetTagged';

export default function LockNumberChanged(control) {
    MaxContentLength(control, FieldMaxLengths.LockNumber);
}

function MaxContentLength(control, maxLength) {
    const valueLength = control.getValue().length;
    if (maxLength < valueLength) {
        CommonLibrary.executeInlineControlError(control, control, control.localizeText('exceeds_max_length_x_x', [valueLength, maxLength]));
    } else {
        CommonLibrary.clearValidationOnInput(control);
    }
}
