
import NativeScriptObject from '../Common/Library/NativeScriptObject';

export default function DocumentEditorSaveAttachment(context, attachment, fileName) {
    let fileSystemModule = NativeScriptObject.getNativeScriptObject(context).fileSystemModule;
    let tempFolder = fileSystemModule.knownFolders.temp();
    let documentPath = fileSystemModule.path.join(tempFolder.path, fileName);
    let documentFileObject = fileSystemModule.File.fromPath(documentPath);
    
    documentFileObject.writeSync(attachment.content, () => {
        context.getClientData().Error=context.localizeText('create_document_failed');
        context.executeAction('/SAPAssetManager/Actions/ErrorBannerMessage.action');
    });

    // save original unchanged file for later retreival if needed.
    const folderPath = fileSystemModule.path.join(tempFolder.path, 'orig');
    const folder = fileSystemModule.Folder.fromPath(folderPath);
    documentPath = fileSystemModule.path.join(folder.path, fileName);
    documentFileObject = fileSystemModule.File.fromPath(documentPath);
    documentFileObject.writeSync(attachment.content, () => {
        context.getClientData().Error=context.localizeText('create_document_failed');
        context.executeAction('/SAPAssetManager/Actions/ErrorBannerMessage.action');
    });

    return tempFolder.path + '/';
}
