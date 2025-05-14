
import libCom from '../Common/Library/CommonLibrary';
import getFileInfo from './DocumentEditorGetFileInfo';

export default function DocumentEditorImageViewPath(context) {
    const fileInfo = getFileInfo(context);
    const newImg = libCom.getStateVariable(context, 'DocumentEditorEstimatedImageSource');

    if (fileInfo && newImg) {
        const filePath = fileInfo.Directory + fileInfo.FileName + '.tmp';
        const fileExt = fileInfo.FileName.split('.').pop().toLowerCase();
        if (newImg.saveToFile(filePath, fileExt)) {
            return filePath;
        }
    }

    return '';
}
