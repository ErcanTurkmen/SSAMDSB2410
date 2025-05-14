import libCom from '../Common/Library/CommonLibrary';
import SetUpAttachmentTypes from '../Documents/SetUpAttachmentTypes';

/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function AddEditDocumentPageOnLoaded(context) {
    SetUpAttachmentTypes(context);

    let attachmentData = libCom.getStateVariable(context, 'InspectionCharacteristicsAttachments');
    let attachmentCtrl = context.getControl('FormCellContainer').getControl('Attachment');

    if (attachmentCtrl && attachmentData) {
        let formCell = context.getControl('FormCellContainer');
        if (formCell) {
            let attachmentControl = formCell.getControl('Attachment');
            if (attachmentControl) {
                attachmentControl.getClientData().attachmentCount = attachmentData.length;
            }
        }
       
        attachmentCtrl.setValue(attachmentData, true);
    }

    libCom.saveInitialValues(context);
}
