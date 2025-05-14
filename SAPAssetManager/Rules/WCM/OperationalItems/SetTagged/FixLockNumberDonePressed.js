import { ConfirmMessageMap, SubmitTagConfirmDialog, SubmitTagSuccessToasMessage, UpdateLockNumber } from './SubmitSetTagged';
import { ValidateFixLockNumber } from './ValidateSetTagged';

export default function FixLockNumberDonePressed(context) {
    const isValid = ValidateFixLockNumber(context);
    if (!isValid) {
        return context.executeAction('/SAPAssetManager/Actions/Forms/FSM/FormValidationErrorBanner.action');
    }
    return SubmitTagConfirmDialog(context, context.localizeText(ConfirmMessageMap[context.binding.taggingState]))
        .then(() => UpdateLockNumber(context))
        .then(() => context.executeAction('/SAPAssetManager/Actions/Page/PreviousPage.action'))
        .then(() => SubmitTagSuccessToasMessage(context, context.localizeText('lock_number_updated')));
}
