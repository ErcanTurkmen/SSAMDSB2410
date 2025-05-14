import getFileInfo from './DocumentEditorGetFileInfo';
import libCom from '../Common/Library/CommonLibrary';

export default function DocumentEditorOnDelete(context) {
    return context.getPageProxy().executeAction({'Name' : '/SAPAssetManager/Actions/Common/GenericWarningDialog.action', 'Properties': {
        'Title': context.localizeText('confirm'),
        'Message': context.localizeText('confirm_delete'),
        'OKCaption': context.localizeText('ok'),
        'CancelCaption': context.localizeText('cancel'),
    }}).then(result => {
        if (result.data === true) {
            const fileInfo = getFileInfo(context);
            if (fileInfo) {
                const tempFile = context.nativescript.fileSystemModule.File.fromPath(fileInfo.Directory + fileInfo.FileName);
                if (tempFile) {
                    tempFile.remove();
                }
            }

            // If file is opened in document editor from Attachment form cell, 
            // then when deleting it, we initially remove it from value of Attachment form cell. 
            //
            // Since MDK implies deleting files from Attachment form cell only through built-in controls 
            // and doesn't provide ability to simulate deletion through custom controls, 
            // in fact we had to duplicate functionality from https://github.tools.sap/MobileDevelopmentKit/sdk/blob/master/mdk-core/src/observables/AttachmentFormCellObservable.ts
            if (libCom.getStateVariable(context, 'DocumentEditorNavType') === 'Attachment') {
                const attachmentIndex = fileInfo.AttachmentIndex;
                const attachmentControl = context.evaluateTargetPathForAPI('#Page:-Previous').getControl('FormCellContainer').getControl('Attachment');
                const attachments = [...attachmentControl.getValue()];
                const deletedAttachments = attachments.splice(attachmentIndex, 1);

                // If we delete file that was previously saved in database, 
                // then we additionally need to add it to DeletedAttachments list so that when parent object is saved, 
                // it will be deleted from database too (please see DocumentCreateDelete.js file)
                if (deletedAttachments[0]?.readLink) {
                    const attachmentControlClientData = attachmentControl.getClientData();
                    attachmentControlClientData.DeletedAttachments = (attachmentControlClientData.DeletedAttachments ?? []).concat(deletedAttachments);
                }

                attachmentControl.setValue(attachments);

                return context.executeAction('/SAPAssetManager/Actions/Page/PreviousPage.action');
            }

            return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
                let binding = context.getPageProxy().getBindingObject();
                return context.getPageProxy().executeAction({'Name': '/SAPAssetManager/Actions/Common/GenericDelete.action', 'Properties': {
                    'Target': {
                        'EntitySet' : 'Documents',
                        'ReadLink' : binding.Document['@odata.readLink'],
                    },
                }}).then(() => {
                    return context.getPageProxy().executeAction({'Name': '/SAPAssetManager/Actions/Common/GenericDelete.action', 'Properties': {
                        'Target': {
                            'EntitySet' : binding['@odata.type'].split('.').pop() + 's',
                            'ReadLink' : binding['@odata.readLink'],
                        },
                    }});
                });
            });
        }
        return Promise.resolve();
    });
}
