import libCommon from '../../Common/Library/CommonLibrary';
import newlyCreatedDocsQuery from './NewlyCreatedDocsQuery';
import createIssueorReceiptSignature from '../IssueOrReceipt/IssueOrReceiptSignatureCreate';
import Logger from '../../Log/Logger';
/**
* Final function, before closing items list modal.
* Clears all state variables, then shows success message 
* (if 'isDeleted' param in false) and closes the page
* if count of current items in the document is 0 and not isDeleted,
* then calls warning modal and locks save of the document
* @param {IClientAPI} context
* @param {boolean} isDeleted
*/
export default function SaveCreatedDocuments(context, isDeleted = false) {
    if (isDeleted) {
        emptyStateVariables(context);
        return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
    } else {
        let query = newlyCreatedDocsQuery(context);
        return context.count('/SAPAssetManager/Services/AssetManager.service', 'MaterialDocItems', query).then(count => {
            if (count) {
                emptyStateVariables(context);
                return context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/DocumentCreateSuccessWithClose.action');
            }
            return context.executeAction({
                'Name': '/SAPAssetManager/Actions/Common/GenericEndDateWarningDialog.action',
                'Properties': {
                    'Title': context.localizeText('error'),
                    'Message': context.localizeText('no_items_doc_save_issue'),
                },
            });
        }).then(() => {
            // create media 
            return context.executeAction('/SAPAssetManager/Rules/Common/ChangeSet/ChangeSetOnSuccess.js');
        }).catch(error => Logger.error('SaveCreatedDocuments error', error))
        .then(() => {
                //create signature
                createIssueorReceiptSignature(context);
            });
}
}

function emptyStateVariables(context) {
    libCommon.setStateVariable(context, 'ActualDocId', '');
    libCommon.setStateVariable(context, 'IsAlreadyCreatedDoc', false);
    libCommon.setStateVariable(context, 'FixedData', '');
    libCommon.setStateVariable(context, 'CurrentDocsItemsMovementType', '');
    libCommon.setStateVariable(context, 'CurrentDocsItemsStorageLocation', '');
    libCommon.setStateVariable(context, 'CurrentDocsItemsPlant', '');
    libCommon.setStateVariable(context, 'CurrentDocsItemsOrderNumber', '');
    libCommon.setStateVariable(context, 'IMMovementType', '');
    libCommon.setStateVariable(context, 'IMObjectType', '');
}

