
import libCom from '../../../Common/Library/CommonLibrary';
import { DocumentValidate } from '../../Validation/ValidateIssueOrReceipt';
import DocumentLibrary from '../../../Documents/DocumentLibrary';
import { RequiredDirective } from '../../../Common/Library/ValidationLibrary';

export default function BulkIssueOrReceiptPostWrapper(context) {
    //validations
    return ValidateFields(context).then(isValid => {
        if (isValid) {
            //set state variables for attachment and signature creation
            createVariables(context);
            context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/BulkUpdate/BulkIssueOrReceiptCreateChangeset.action')
            .then(() => libCom.navigateOnRead(context, '/SAPAssetManager/Actions/Inventory/IssueOrReceipt/BulkUpdate/BulkIssueOrReceiptNav.action', context.binding['@odata.readLink']));
        }
        return Promise.resolve();
    });
}

function createVariables(context) {
    const formCellContainer = context.getPageProxy().getControl('FormCellContainer');
    const attachmentDescription = formCellContainer.getControl('AttachmentDescription').getValue() || '';
    const attachments = formCellContainer.getControl('Attachment').getValue();
    const signature = formCellContainer.getControl('SignatureCaptureFormCell').getValue();
    const signatureUser = formCellContainer.getControl('Signatory').getValue();
    if (signature) {
        const signatureContentType = formCellContainer.getControl('SignatureCaptureFormCell').getValue().contentType;
        libCom.setStateVariable(context, 'signatureContentType', signatureContentType);
    }
    libCom.setStateVariable(context, 'DocDescription', attachmentDescription);
    libCom.setStateVariable(context, 'Doc', attachments);
    libCom.setStateVariable(context, 'signature', signature);
    libCom.setStateVariable(context, 'signatureUser', signatureUser);
    libCom.setStateVariable(context, 'Class', 'MaterialDocument');
    libCom.setStateVariable(context, 'ObjectKey', 'MaterialDocNumber');
    libCom.setStateVariable(context, 'entitySet', 'MatDocAttachments');
    libCom.setStateVariable(context, 'parentEntitySet', 'MaterialDocuments');
    libCom.setStateVariable(context, 'parentProperty', 'MaterialDocument_Nav');
    libCom.setStateVariable(context, 'attachmentCount', DocumentLibrary.validationAttachmentCount(context));
}

function ValidateFields(context) {
    const formCellContainer = context.getPageProxy().getControl('FormCellContainer');
    const movementTypePicker = formCellContainer.getControl('MovementTypePicker');
    const postingDate = formCellContainer.getControl('PostingDate');
    [movementTypePicker, postingDate].forEach(c => c.clearValidation());

    const validations = [ 
        RequiredDirective(movementTypePicker),
        RequiredDirective(postingDate),
        DocumentValidate(context),
    ];

    return Promise.all(validations).then(results => results.every(validationResult => validationResult));
}
