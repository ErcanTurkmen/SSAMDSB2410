import FinalizeCompletePage from './FinalizeCompletePage';
import WorkOrderCompletionLibrary from './WorkOrderCompletionLibrary';

export default function CancelCompletePageMessage(context) {
    const mandatoryStepsExist = WorkOrderCompletionLibrary.areAnyStepsMandatory(context);
    const isAutoCompleteOnApproval = WorkOrderCompletionLibrary.getInstance().getIsAutoCompleteOnApprovalFlag(context);

    if (isAutoCompleteOnApproval) {
        if (mandatoryStepsExist) {
            return context.executeAction('/SAPAssetManager/Actions/Supervisor/OnAutoCompleteCancelErrorDialog.action');
        } else {
            return FinalizeCompletePage(context);
        }
    } else {
        return context.executeAction(
            {
                'Name': '/SAPAssetManager/Actions/Common/GenericWarningDialog.action',
                'Properties': {
                    'Title': context.localizeText('canceling_completion_title'),
                    'Message': context.localizeText('canceling_completion_message'),
                    'OKCaption': context.localizeText('ok'),
                    'CancelCaption': context.localizeText('cancel'),
                    'OnOK': '/SAPAssetManager/Rules/WorkOrders/Complete/CancelCompletePage.js',
                },
            },
        );     
    }
}
