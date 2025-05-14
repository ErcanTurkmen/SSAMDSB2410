import libCom from '../Common/Library/CommonLibrary';
import libVal from '../Common/Library/ValidationLibrary';
import isEditMode from './DocumentEditorIsEditMode';
import exitEditMode from './DocumentEditorExitEditMode';
import isCropMode from './DocumentEditorIsCropMode';
import exitCropMode from './DocumentEditorExitCropMode';
import documentEditorCreateLink from './DocumentEditorCreateLink';
import getFileInfo from './DocumentEditorGetFileInfo';
import attachmentFileName from './DocumentEditorAttachmentFileName';
import saveAttachment from './DocumentEditorSaveAttachment';
import setFileInfo from './DocumentEditorSetFileInfo';
import isAndroid from '../Common/IsAndroid';


export default function DocumentEditorOnSave(context) {
    const navType = libCom.getStateVariable(context, 'DocumentEditorNavType');
    if (navType === 'Attachment') {
        context.dismissActivityIndicator();
        if (isEditMode(context)) {
            return exitEditMode(context).then(() => {
                return Promise.resolve(true);
            });
        } else if (isCropMode(context)) {
            return exitCropMode(context).then(() => {
                return Promise.resolve(true);
            });
        }
        return context.executeAction('/SAPAssetManager/Actions/Page/PreviousPage.action');
    } else {
        const saveType = libCom.getStateVariable(context, 'DocumentEditorSaveType');
        if (!libVal.evalIsEmpty(saveType)) {
            const isOverwrite = saveType === 'Overwrite';
            const execuateAction = isOverwrite ?
                '/SAPAssetManager/Actions/Documents/DocumentEditorUpdate.action':
                '/SAPAssetManager/Actions/Documents/DocumentEditorCreate.action';
            return context.executeAction(execuateAction).then((data) => {
                context.dismissActivityIndicator();
                if (isEditMode(context)) {
                    return exitEditMode(context).then(() => {
                        return DocumentEditorOnSaveInternal(context, data, saveType);
                    });
                } else if (isCropMode(context)) {
                    return exitCropMode(context).then(() => {
                        return DocumentEditorOnSaveInternal(context, data, saveType);
                    });
                }
                return DocumentEditorOnSaveInternal(context, data, saveType);
            }).catch(() => context.dismissActivityIndicator());
        }
    }
}

function DocumentEditorOnSaveInternal(context, data, saveType) {
    if (saveType === 'Overwrite') {
        return DocumentEditorOnSaveUpdate(context);
    } else if (saveType === 'Recreate') {
        return documentEditorCreateLink(context, data.data[0]).then(() => {
            const binding = context.getPageProxy().getBindingObject();
            const entitySet = binding['@odata.type'].split('.').pop() + 's';
            return context.getPageProxy().executeAction({'Name': '/SAPAssetManager/Actions/Common/GenericDelete.action', 'Properties': {
                'Target': {
                    'EntitySet' : entitySet,
                    'Service' : '/SAPAssetManager/Services/AssetManager.service',
                    'ReadLink' : binding['@odata.readLink'],
                },
            }}).then(() => {
                return DocumentEditorOnSaveCreate(context);
            });
        });
    }
    return documentEditorCreateLink(context, data.data[0]).then(() => {
        return DocumentEditorOnSaveCreate(context);
    });
}

function DocumentEditorOnSaveUpdate(context) {
    setFileInfo(context, undefined);
    return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
        return context.executeAction('/SAPAssetManager/Actions/Documents/DocumentEditorUpdateSuccess.action');
    });
}

function DocumentEditorOnSaveCreate(context) {
    setFileInfo(context, undefined);
    return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
        return context.executeAction('/SAPAssetManager/Actions/Documents/DocumentEditorCreateSuccess.action');
    });
}

export function DocumentEditorSaveFile(context) {
    const control = context.getPageProxy()._page.previousPage.controls[0].controls.find(function(ctl) {
        return ctl.controlProxy.getName() === 'Attachment';
    });
    if (control) {
        const fileInfo = getFileInfo(context);
        const attachments = control.getValue().map(obj => {
            const fileName = attachmentFileName(obj);
            if (!obj.urlStringWithFileName.startsWith('file') || !isAndroid(context)) { // workaround for iOS
                const directory = fileInfo.FileName === fileName ?
                    fileInfo.Directory : saveAttachment(context, obj, fileName);
                return DocumentEditorCreateAttachmentEntry(control.controlProxy, fileName, directory, obj.readLink);
            }
            return obj;
        }).filter(obj => !!obj);
        control.setValue(attachments, false);
        setFileInfo(context, undefined);
        return true;
    }
    return false;
}

function DocumentEditorCreateAttachmentEntry(context, fileName, directory, readLink) {
    const entitySet = 'Attachments', property = 'Attachments';
    const service = '/SAPAssetManager/Services/AssetManager.service';
    return context.createAttachmentEntry(directory + fileName, entitySet, property, readLink, service);
}
