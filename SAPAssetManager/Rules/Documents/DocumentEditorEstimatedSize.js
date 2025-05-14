
import libCom from '../Common/Library/CommonLibrary';
import getFileInfo from './DocumentEditorGetFileInfo';

export default function DocumentEditorEstimatedSize(context) {
    const newImg = libCom.getStateVariable(context, 'DocumentEditorEstimatedImageSource');
    if (newImg) {
        const fileInfo = getFileInfo(context);
        if (fileInfo) {
            const extension = fileInfo.FileName.split('.').pop().toLowerCase();
            if (newImg.saveToFile(fileInfo.Directory + fileInfo.FileName + '.tmp', extension)) {
                const filePath = context.nativescript.fileSystemModule.File.fromPath(fileInfo.Directory + fileInfo.FileName + '.tmp');
                return libCom.formatFileSizeString(filePath.size);
            }
        }
    }
    return context.localizeText('error');
}
