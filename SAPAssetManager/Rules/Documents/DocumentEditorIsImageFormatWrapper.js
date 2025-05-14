import isImageFormat from './DocumentEditorIsImageFormat';
import getFileInfo from './DocumentEditorGetFileInfo';
import DocumentLibrary from './DocumentLibrary';

export default function DocumentEditorIsImageFormatWrapper(context) {
    const documentBinding = DocumentLibrary.getDocumentFromBinding(context.binding);
    const fileName = documentBinding?.FileName;
    if (fileName?.slice(0,4) === 'Sig_') {
        return false;
    }
    if (context.binding['@odata.type'] === '#sap_mobile.MatDocAttachment' ) {
        return false;
    }
    const fileInfo = getFileInfo(context);
    if (fileInfo) {
        return isImageFormat(fileInfo.FileName);
    }
    return false;
}
