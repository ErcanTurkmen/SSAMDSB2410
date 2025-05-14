import libCom from '../Common/Library/CommonLibrary';
import getFileInfo from './DocumentEditorGetFileInfo';
import saveImage from './DocumentEditorOnSave';

export default function DocumentEditorSaveImage(context) {
    const navType = libCom.getStateVariable(context, 'DocumentEditorNavType');
    if (navType === 'Attachment') {
        return save(context);
    } else {
        return context.executeAction('/SAPAssetManager/Actions/Documents/DocumentEditorSaveImage.action').then((result) => {
            if (result.data === 'Save') {
                return save(context);
            } else if (result.data === 'SaveAs') {
                return context.executeAction('/SAPAssetManager/Actions/Documents/DocumentEditorSaveAsNav.action');
            }
            return Promise.resolve(true);
        });
    }
}

function save(context) {
    const newImg = libCom.getStateVariable(context, 'DocumentEditorEstimatedImageSource');
    if (newImg) {
        const fileInfo = getFileInfo(context);
        if (fileInfo) {
            const fileExt = fileInfo.FileName.split('.').pop().toLowerCase();
            if (newImg.saveToFile(fileInfo.Directory + fileInfo.FileName, fileExt)) {
                const tempFile = context.nativescript.fileSystemModule.File.fromPath(
                        fileInfo.Directory + fileInfo.FileName + '.tmp',
                );
                if (tempFile) {
                    tempFile.remove();
                }
                libCom.setStateVariable(context, 'DocumentEditorSaveType', fileInfo.IsDeleteAllowed ? 'Recreate' : 'Overwrite');
                context.showActivityIndicator();
                return saveImage(context);
            }
        }
    } 
    return Promise.resolve(false);          
}
