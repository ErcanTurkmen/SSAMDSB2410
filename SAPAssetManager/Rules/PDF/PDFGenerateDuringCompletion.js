import IsServiceReportFeatureEnabled from './IsServiceReportFeatureEnabled';
import PDFGenerate from './PDFGenerate';
import CommonLibrary from '../Common/Library/CommonLibrary';
import { IsBulkConfirmationQueueActive, RunNextBulkConfirmationAction } from '../WorkOrders/Operations/BulkConfirmationQueue';

export default function PDFGenerateDuringCompletion(context, binding) {
    if (IsServiceReportFeatureEnabled(context)) {
        return context.executeAction({
            'Name': '/SAPAssetManager/Actions/Common/GenericWarningDialog.action',
            'Properties':
            {
                'Title': '$(L, confirm_status_change)',
                'Message': '$(L,generate_service_report_warning)',
                'OKCaption': '$(L,ok)',
                'CancelCaption': '$(L,cancel)',
            },
        }).then(actionResult => {
            if (actionResult.data === true) {
                return PDFGenerate(context, binding);
            } else {
                CommonLibrary.removeBindingObject(context);
                CommonLibrary.removeStateVariable(context, 'contextMenuSwipePage');

                if (IsBulkConfirmationQueueActive(context)) {
                    return RunNextBulkConfirmationAction(context);
                }

                return Promise.resolve();
            }
        });
    } else {
        CommonLibrary.removeBindingObject(context);
        CommonLibrary.removeStateVariable(context, 'contextMenuSwipePage');

        if (IsBulkConfirmationQueueActive(context)) {
            return RunNextBulkConfirmationAction(context);
        }

        return Promise.resolve();
    }

}
