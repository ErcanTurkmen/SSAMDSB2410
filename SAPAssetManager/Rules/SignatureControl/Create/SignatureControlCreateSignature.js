import { IsBulkConfirmationSignatureFlowActive, StoreBulkConfirmationSignature } from '../../WorkOrders/Operations/BulkConfirmationLibrary';
import WorkOrderOperationsConfirmation from '../../WorkOrders/Operations/WorkOrderOperationsConfirmation';

export default function SignatureControlCreateSignature(context) {
    if (IsBulkConfirmationSignatureFlowActive(context)) {
        return StoreBulkConfirmationSignature(context).then(() => {
            return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
                return WorkOrderOperationsConfirmation(context);
            });
        });
    }

    return context.executeAction('/SAPAssetManager/Actions/SignatureControl/Create/SignatureControlCreateSignature.action');
}
