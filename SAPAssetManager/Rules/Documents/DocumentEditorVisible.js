import getFileInfo from './DocumentEditorGetFileInfo';

export default function DocumentEditorVisible(context) {
    const fileInfo = getFileInfo(context);
    if (context.binding['@odata.type'] === '#sap_mobile.MatDocAttachment' ) {
        return false;
    }
    return fileInfo && fileInfo.FileName.slice(0,4) !== 'Sig_';
}
