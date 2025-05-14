import libCom from '../Common/Library/CommonLibrary';
import {DocumentEditorSaveFile} from './DocumentEditorOnSave';
import DocumentAutoResizeImage from './DocumentAutoResizeImage';
import DocumentEditorIsAutoResizeEnabled from './DocumentEditorIsAutoResizeEnabled';
import isEditMode from './DocumentEditorIsEditMode';
import exitEditMode from './DocumentEditorExitEditMode';
import isCropMode from './DocumentEditorIsCropMode';
import exitCropMode from './DocumentEditorExitCropMode';
import NativeScriptObject from '../Common/Library/NativeScriptObject';
import getFileInfo from './DocumentEditorGetFileInfo';
import setFileInfo from './DocumentEditorSetFileInfo';
import Logger from '../Log/Logger';

/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function DocumentEditorBackButtonPressed(context) {
    if (libCom.getStateVariable(context, 'DocumentEdited')) {
        return handleDocumentEditorRevert(context);
    } else {
        // check if we are in edit/crop mode, in that case we just need to revert back to prev mode
        if (isCropMode(context)) {
            return exitCropMode(context).then(() => {
                return Promise.resolve(false);
            });
        }
        if (isEditMode(context)) {
            return exitEditMode(context).then(() => {
                return Promise.resolve(false);
            });
        }
        if (DocumentEditorIsAutoResizeEnabled(context)) {
            return resizeImage(context);
        }
    }
}

function handleDocumentEditorRevert(context) {
    libCom.clearStateVariable(context, 'DocumentEdited');
    return context.executeAction('/SAPAssetManager/Actions/Documents/DocumentEditorOnCancel.action').then((result) => {
        if (result.data === true) {
          discardDocumentChangesAndNavigate(context);
        }
        return Promise.resolve(false);
    });
}

function discardDocumentChangesAndNavigate(context) {
    // need to delete file from temp directory only if it was just imported
    // in other cases skipping this step
    const needsDelete = context.getPageProxy().getClientData().needsDelete;
    if (needsDelete) {
        // Since user may have made edits he wants to discard, revert back to orig file
        const fileInfo = getFileInfo(context);
        let fs = NativeScriptObject.getNativeScriptObject(context).fileSystemModule;
        let documentPath = fs.path.join(fileInfo.Directory, fileInfo.FileName);
        let documentFileObject = fs.File.fromPath(documentPath);
        documentFileObject.removeSync((error) => {
            // cant to anything, lets just return to previous screen as-is
            Logger.error('IMAGE_EDITOR', error);
            if (DocumentEditorIsAutoResizeEnabled(context)) {
                return resizeImage(context);
            } else {
                return Promise.resolve(true);
            }
        });

        setFileInfo(context, {
            FileName: fileInfo.FileName, Directory: fileInfo.Directory + 'orig/' , IsDeleteAllowed: false,
        });
    }

    // before discarding we must resize original image if auto-resize is enabled
    if (DocumentEditorIsAutoResizeEnabled(context)) {
        return resizeImage(context);
    } else {
        return context.executeAction('/SAPAssetManager/Actions/Page/PreviousPage.action');
    }
}

function resizeImage(context) {
    context.showActivityIndicator();
    return libCom.sleep(200).then(()=>{
        // long running task
        return DocumentAutoResizeImage(context).then(()=>{
            DocumentEditorSaveFile(context);
            // done, so navigate back
            return context.executeAction('/SAPAssetManager/Actions/Page/PreviousPage.action');
        }).finally(()=>{
            context.dismissActivityIndicator();
        });
    });
    
}
