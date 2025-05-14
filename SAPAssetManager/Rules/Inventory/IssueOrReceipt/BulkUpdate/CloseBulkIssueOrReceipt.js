import checkForChangesBeforeClose from '../../../Common/CheckForChangesBeforeClose';
import libCom from '../../../Common/Library/CommonLibrary';
import Logger from '../../../Log/Logger';
import EmptyStateVariables from './EmptyStateVariables';

export default function CloseBulkIssueOrReceipt(context) {
    const result = checkForChangesBeforeClose(context);
    return result.then(({ data }) => {
        if (data === false) {
            return false;
        }
        libCom.removeStateVariable(context, 'BulkUpdateItem');
        libCom.removeStateVariable(context, 'BulkUpdateTotalItems');
        libCom.removeStateVariable(context, 'IMObjectType');
        libCom.removeStateVariable(context, 'IMMovementType');
        if (libCom.getStateVariable(context, 'MaterialDocNumberBulkUpdate')) {
            return context.executeAction('/SAPAssetManager/Actions/Inventory/MaterialDocument/MaterialDocumentDeleteDuringItemDelete.action')
            .catch((error) => {
                Logger.error('BulkUpdateCancel', error);
            })
            .finally(() => {
                EmptyStateVariables(context);
            });
        }
        return true;
    });
}
