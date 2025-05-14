import CommonLibrary from '../../Common/Library/CommonLibrary';
import { MaxCommentLength } from './InspectionCharacteristicsUpdateValidation';
import ResetValidationOnInput from '../../Common/Validation/ResetValidationOnInput';

export default function InspectionCharacteristicsCommentOnChange(control) {
    if (control.getValue().length > MaxCommentLength) {
        CommonLibrary.executeInlineControlError(control, control, control.localizeText('maximum_field_length', [MaxCommentLength]));
    } else {
        ResetValidationOnInput(control);
    }
}
