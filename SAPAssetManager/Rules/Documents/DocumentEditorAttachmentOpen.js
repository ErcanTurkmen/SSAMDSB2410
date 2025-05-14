import libCom from '../Common/Library/CommonLibrary';
import setFileInfo from './DocumentEditorSetFileInfo';

/**
* Opens Document editor - sets all required arguments before doing this
* @param {IClientAPI} clientAPI
*/
export default function DocumentEditorAttachmentOpen(clientAPI, fileName, directory, additionalFileInfoProps = {}) {
    libCom.setStateVariable(clientAPI, 'DocumentEditorNavType', 'Attachment');
    setFileInfo(clientAPI, {
        FileName: fileName, Directory: directory, IsDeleteAllowed: true, ...additionalFileInfoProps,
    });
    // workaround for iOS extension
    clientAPI.getPageProxy().setActionBinding({
        'Document': {
            'FileName': fileName,
        },
    });
    return clientAPI.executeAction('/SAPAssetManager/Actions/Documents/DocumentEditorNav.action');
}
