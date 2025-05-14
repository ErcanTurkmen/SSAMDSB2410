import libCom from '../../../Common/Library/CommonLibrary';
import { NavigateToPIDetailsPage } from './PhysicalInventoryDocItemUpdatePost';

export default function CheckForChangesBeforeCancel(context) {

    if (libCom.unsavedChangesPresent(context)) {
        return context.executeAction('/SAPAssetManager/Actions/Page/ConfirmCancelPage.action');
    }
    libCom.setOnCreateUpdateFlag(context, '');
    libCom.removeStateVariable(context, 'PIDocumentItemsMap');
    return context.executeAction('/SAPAssetManager/Actions/Page/CancelPage.action').then(() => {
        let bulkUpdateItem = libCom.getStateVariable(context, 'BulkUpdateItem');
        if (bulkUpdateItem > 0) {
            return NavigateToPIDetailsPage(context);
        }
        libCom.removeStateVariable(context, 'BulkUpdateItem'); 
        return undefined;
    });
}
