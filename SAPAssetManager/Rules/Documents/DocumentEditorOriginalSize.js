import getFileInfo from './DocumentEditorGetFileInfo';
import libCom from '../Common/Library/CommonLibrary';

export default function DocumentEditorOriginalSize(context) {
    const fileInfo = getFileInfo(context);
    const filePath = context.nativescript.fileSystemModule.File.fromPath(fileInfo.Directory + fileInfo.FileName);
    const fileSize = filePath ? filePath.size : 0;
    return libCom.formatFileSizeString(fileSize);
}
