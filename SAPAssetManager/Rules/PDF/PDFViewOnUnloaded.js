import CommonLibrary from '../Common/Library/CommonLibrary';
import { IsBulkConfirmationQueueActive, RunNextBulkConfirmationAction } from '../WorkOrders/Operations/BulkConfirmationQueue';

export default function PDFViewOnUnloaded(clientAPI) {
    CommonLibrary.clearStateVariable(clientAPI, 'ServiceReportData');
    CommonLibrary.removeBindingObject(clientAPI);
    CommonLibrary.removeStateVariable(clientAPI, 'contextMenuSwipePage');

    if (IsBulkConfirmationQueueActive(clientAPI)) {
        return RunNextBulkConfirmationAction(clientAPI);
    }
    return Promise.resolve(true);
}
