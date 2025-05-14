import CommonLibrary from '../../../Common/Library/CommonLibrary';
import libLocal from '../../../Common/Library/LocalizationLibrary';

export default function LengthValidation(context,  control,  length_field, start, end) {
    CommonLibrary.clearValidationOnInput(control);
    if (!length_field) {
        let message = context.localizeText('field_is_required');
        CommonLibrary.executeInlineControlError(context, control, message);
        return Promise.reject(false);
    } else if (libLocal.toNumber(context, length_field) <= 0) {
        let message = context.localizeText('positive_length');
        CommonLibrary.executeInlineControlError(context, control, message);
        return Promise.reject(false);
    } else {
        if (CommonLibrary.isDefined(start) && CommonLibrary.isDefined(end)) {
            const diff = Math.abs(libLocal.toNumber(context, end) - libLocal.toNumber(context, start));
            const diffFormatted = context.formatNumber(diff, '', {useGrouping : false}); // using the same formatting as when we set the length field, otherwise don't match
            if (length_field !== diffFormatted) {
                let message = context.localizeText('validation_length_equal_end_start_diff');
                CommonLibrary.executeInlineControlError(context, control, message);
                return Promise.reject(false);
            }
        }
    }
}
