import checkForChangesBeforeClose from '../../Common/CheckForChangesBeforeClose';
import libCom from '../../Common/Library/CommonLibrary';
import AnalyticsManager from '../../AnalyticsManager/AnalyticsManagerLibrary';
/**
* Asking clarification from user to close page (don't save changes)
* Then, if we're adding multiple items to doc (not first one), we change
* close page action to redirection to the item list page
* @param {IClientAPI} context
*/
export default function CloseIssueOrReceipt(context) {
    let result = checkForChangesBeforeClose(context);
    let document = libCom.getStateVariable(context, 'ActualDocId');
    let created = libCom.getStateVariable(context, 'IsAlreadyCreatedDoc');
    let move = libCom.getStateVariable(context, 'IMMovementType');
    libCom.removeStateVariable(context, 'TransactionType');
    if (document) {
        return result.then(({ data }) => {
            if (data === false) {
                return false;
            }
            if (created) {
                context.getPageProxy().setActionBinding({});
            }
            libCom.removeStateVariable(context, 'MaterialPlantValue');
            libCom.removeStateVariable(context, 'MaterialSLocValue');
            libCom.removeStateVariable(context, 'BatchRequiredForFilterADHOC');
            return context.executeAction('/SAPAssetManager/Actions/Inventory/MaterialDocument/MaterialDocumentModalListNav.action').then(() => {
                if (move === 'I') {
                    AnalyticsManager.goodsIssueCancel();
                } else if (move === 'R') {
                    AnalyticsManager.goodsReceiptCancel();
                } else {
                    return;
                }
            });
        });
    } else {
        return result.then(({ data }) => {
            if (data === false) {
                return false;
            }
            libCom.removeStateVariable(context, 'MaterialPlantValue');
            libCom.removeStateVariable(context, 'MaterialSLocValue');
            libCom.removeStateVariable(context, 'BatchRequiredForFilterADHOC');
            if (move === 'I') {
                AnalyticsManager.goodsIssueCancel();
            } else if (move === 'R') {
                AnalyticsManager.goodsReceiptCancel();
            }
            return true;
        });
    }
}
