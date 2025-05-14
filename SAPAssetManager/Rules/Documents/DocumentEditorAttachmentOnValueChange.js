import attachmentFileName from './DocumentEditorAttachmentFileName';
import saveAttachment from './DocumentEditorSaveAttachment';
import isImageFormat from './DocumentEditorIsImageFormat';
import attachmentEditorOpen from './DocumentEditorAttachmentOpen';
import isPdfFormat from './DocumentEditorIsPdfFormat';

export default function DocumentEditorAttachmentOnValueChange(context) {
    const attachmentCount = context.getValue().length;
    let attachmentCountBeforeValueChanged = context.getClientData().attachmentCount;

    if (!attachmentCountBeforeValueChanged) {
        attachmentCountBeforeValueChanged = 0;
    }

    let openEditor = false;
    let editableAttachmentIndex, editableAttachment, editableAttachmentFileName;

    if (attachmentCount > attachmentCountBeforeValueChanged) {
        const isOneAttachmentAdded = (attachmentCount - attachmentCountBeforeValueChanged) === 1;

        if (isOneAttachmentAdded) { // checks if only one attachment was added
            editableAttachmentIndex = attachmentCount - 1;
            editableAttachment = context.getValue()[editableAttachmentIndex];
            editableAttachmentFileName = attachmentFileName(editableAttachment);
            openEditor = isImageFormat(editableAttachmentFileName) || isPdfFormat(editableAttachmentFileName);
        } else { // checks if in multiple added attachments only one is editable
            const addedEditableAttachments = context.getValue().slice(attachmentCountBeforeValueChanged, attachmentCount).filter(attachment => {
                const fileName = attachmentFileName(attachment);
                return isImageFormat(fileName) || isPdfFormat(fileName);
            });

            if (addedEditableAttachments.length === 1) {
                editableAttachment = addedEditableAttachments[0];
                editableAttachmentIndex = context.getValue().findIndex(attachment => attachment === editableAttachment);
                editableAttachmentFileName = attachmentFileName(editableAttachment);
                openEditor = true;
            }
        }
    }

    context.getClientData().attachmentCount = attachmentCount;
    return openEditor ? openAttachmentEditor(context, editableAttachment, editableAttachmentFileName, editableAttachmentIndex) : Promise.resolve();
}

function openAttachmentEditor(context, attachment, fileName, attachmentIndex) {
    const directory = saveAttachment(context, attachment, fileName);
    return attachmentEditorOpen(context, fileName, directory, { AttachmentIndex: attachmentIndex });
}
