import { ConfirmMessageMap, SubmitTagConfirmDialog, SubmitTagSuccessToasMessage, SuccessToastMessageMap, TaggingStateMap } from './SubmitSetTagged';
import ValidateSetTagged from './ValidateSetTagged';
import AnalyticsManager from '../../../AnalyticsManager/AnalyticsManagerLibrary';

export default function SetTaggedDonePressed(context) {
    const isValid = ValidateSetTagged(context);
    if (!isValid) {
        return context.executeAction('/SAPAssetManager/Actions/Forms/FSM/FormValidationErrorBanner.action');
    }
    const taggingAction = TaggingStateMap[context.binding.taggingState];
    const successMessage = SuccessToastMessageMap[context.binding.taggingState];  // need to assign these here, because binding.taggingState is volatile between tagging and page navigations
    return SubmitTagConfirmDialog(context, context.localizeText(ConfirmMessageMap[context.binding.taggingState]))
        .then(() => taggingAction(context))
        .then(() => context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action'))
        .then(() => SubmitTagSuccessToasMessage(context, context.localizeText(successMessage))).then(() => {
            //Add AnalyticsManager Check
            //tagging state 2 is for tagged, 3 is for untagged
            if (context.binding.taggingState === 2) {
                AnalyticsManager.operationalItemLockSuccess();
            }
            if (context.binding.taggingState === 3) {
                AnalyticsManager.operationalItemUnlockSuccess();
            }
        });
}
