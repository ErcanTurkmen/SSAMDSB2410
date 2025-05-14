import { IsBulkConfirmationSignatureRequired, ResetBulkConfirmationSignatureFlow, RunBulkConfirmationSignatureFlow } from './BulkConfirmationLibrary';
import WorkOrderOperationsConfirmation from './WorkOrderOperationsConfirmation';
import Logger from '../../Log/Logger';
import libCom from '../../Common/Library/CommonLibrary';

export default function StartBulkConfirmationProcess(context) {
    return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
        const assignmentType = libCom.getWorkOrderAssnTypeLevel(context);
        if (assignmentType === 'Operation' && IsBulkConfirmationSignatureRequired(context)) {
            return RunBulkConfirmationSignatureFlow(context)
                .catch(() => {
                    ResetBulkConfirmationSignatureFlow(context);
                    Logger.info('User rejected a mandatory signature');
                });
        }

        return WorkOrderOperationsConfirmation(context);
    });
}
