
import getFileInfo from './DocumentEditorGetFileInfo';
import DocumentLibrary from './DocumentLibrary';

export default function DocumentEditorFileName(context, encode = false) {
    const fileInfo = getFileInfo(context) || DocumentLibrary.getDocumentFromBinding(context.binding);
    return encode ? encodeURIComponent(fileInfo.FileName) : fileInfo.FileName;
}
