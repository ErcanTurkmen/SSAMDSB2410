import attachmentFileName from './DocumentEditorAttachmentFileName';
import isImageFormat from './DocumentEditorIsImageFormat';
import isPdfFormat from './DocumentEditorIsPdfFormat';
import attachmentEditorOpen from './DocumentEditorAttachmentOpen';
import saveAttachment from './DocumentEditorSaveAttachment';
import libCom from '../Common/Library/CommonLibrary';

/**
* Called when user presses on already added photo in the attachment section
* Function get all required data and launches document editor
* @param {IClientAPI} clientAPI
*/
export default function DocumentEditorAttachmentOnPress(clientAPI) {
    const attachment = clientAPI.getValue();
    const fileName = attachmentFileName(attachment);
    if (isImageFormat(fileName) || isPdfFormat(fileName)) {
        clientAPI.showActivityIndicator('');
        libCom.setStateVariable(clientAPI, 'DocumentEditorNavFromCell', true);
        const directory = saveAttachment(clientAPI, attachment, fileName);
        return attachmentEditorOpen(clientAPI, fileName, directory, { AttachmentIndex: clientAPI.getIndex() })
            .finally(() => {
                clientAPI.dismissActivityIndicator('');
            });
    }
    return Promise.resolve(true);
}
