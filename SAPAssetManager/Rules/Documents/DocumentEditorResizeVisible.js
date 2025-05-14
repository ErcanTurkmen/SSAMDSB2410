import isImageFormat from './DocumentEditorIsImageFormat';
import getFileInfo from './DocumentEditorGetFileInfo';
import libCom from '../Common/Library/CommonLibrary';
import DocumentEditorIsAutoResizeEnabled from './DocumentEditorIsAutoResizeEnabled';
import DocumentLibrary from './DocumentLibrary';

/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function DocumentEditorResizeVisible(context) {
    const documentBinding = DocumentLibrary.getDocumentFromBinding(context.binding);

    const fileName =documentBinding?.FileName;
    if (fileName.slice(0,4) === 'Sig_') {
        return false;
    }
    if (context.binding['@odata.type'] === '#sap_mobile.MatDocAttachment' ) {
        return false;
    }
    const navType = libCom.getStateVariable(context, 'DocumentEditorNavType');
    if (DocumentEditorIsAutoResizeEnabled(context) && navType === 'Attachment') {
        return false;
    }
    const fileInfo = getFileInfo(context);
    if (fileInfo) {
        return isImageFormat(fileInfo.FileName);
    }
    return false;
}
