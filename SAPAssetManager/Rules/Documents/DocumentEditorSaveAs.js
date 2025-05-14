
import libCom from '../Common/Library/CommonLibrary';
import getFileInfo from './DocumentEditorGetFileInfo';
import setFileInfo from './DocumentEditorSetFileInfo';
import saveImage from './DocumentEditorOnSave';

export default function DocumentEditorSaveAs(context) {
    const pageProxy = context.getPageProxy();
    const container = pageProxy.getControl('FormCellContainer');
    const fileNameCtrl = pageProxy.getControl('FormCellContainer').getControl('FileName');
    const descriptionCtrl = pageProxy.getControl('FormCellContainer').getControl('Description');
    const charLimitInt = context.getGlobalDefinition('/SAPAssetManager/Globals/Documents/DocumentDescriptionMaximumLength.global').getValue();

    libCom.setInlineControlErrorVisibility(fileNameCtrl, false);
    libCom.setInlineControlErrorVisibility(descriptionCtrl, false);
    container.redraw();

    const fileInfo = getFileInfo(context);
    const fileNameValue = fileNameCtrl.getValue();
    const descriptionValue = descriptionCtrl.getValue();
    let message = '';

    if (fileNameValue.length >= charLimitInt) {
        message = context.localizeText('validation_maximum_file_name_length', [charLimitInt]);
        libCom.setInlineControlError(context, fileNameCtrl, message);
        libCom.setInlineControlErrorVisibility(fileNameCtrl, true);
    } else if (fileNameValue.length === 0) {
        message = context.localizeText('validation_minimum_file_name_length', [1]);
        libCom.setInlineControlError(context, fileNameCtrl, message);
        libCom.setInlineControlErrorVisibility(fileNameCtrl, true);
    } else if (descriptionValue.length >= charLimitInt) {
        message = context.localizeText('validation_maximum_description_length', [charLimitInt]);
        libCom.setInlineControlError(context, descriptionCtrl, message);
        libCom.setInlineControlErrorVisibility(descriptionCtrl, true);
    } else if (descriptionValue.length === 0) {
        message = context.localizeText('validation_minimum_description_length', [1]);
        libCom.setInlineControlError(context, descriptionCtrl, message);
        libCom.setInlineControlErrorVisibility(descriptionCtrl, true);
    } else {
        const previousPage = context.evaluateTargetPathForAPI('#Page:-Previous');
        let extension = previousPage.getControl('DocumentEditorExtensionControl');
        if (extension) {
            extension = extension._control;
            const fileExt = fileInfo.FileName.split('.').pop().toLowerCase();
            setFileInfo(context, {
                FileName: fileNameValue + '.' + fileExt,
                Directory: fileInfo.Directory,
                IsDeleteAllowed: fileInfo.IsDeleteAllowed,
            });
            libCom.setStateVariable(context, 'DocumentEditorDescription', descriptionValue);
            libCom.setStateVariable(context, 'DocumentEditorSaveType', 'SaveAs');
            extension.saveFile(getFileInfo(context));
            context.showActivityIndicator();
            return;
        } else {
            const newImg = libCom.getStateVariable(context, 'DocumentEditorEstimatedImageSource');
            if (newImg) {
                saveNewImage(fileInfo, newImg, context, descriptionValue);
            }
        }
        return;
    }
    container.redraw();
}

function saveNewImage(fileInfo, newImg, context, descriptionValue) {
    if (fileInfo) {
        const fileExt = fileInfo.FileName.split('.').pop().toLowerCase();
        if (newImg.saveToFile(fileInfo.Directory + fileInfo.FileName, fileExt)) {
            const tempFile = context.nativescript.fileSystemModule.File.fromPath(
                    fileInfo.Directory + fileInfo.FileName + '.tmp',
            );
            if (tempFile) {
                tempFile.remove();
            }
            libCom.setStateVariable(context, 'DocumentEditorSaveType', 'SaveAs');
            libCom.setStateVariable(context, 'DocumentEditorDescription', descriptionValue);
            context.showActivityIndicator();
            saveImage(context);
            return;
        }
    }
}

