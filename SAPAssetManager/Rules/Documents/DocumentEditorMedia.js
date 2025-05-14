import Logger from '../Log/Logger';
import getFileInfo from './DocumentEditorGetFileInfo';
import DocumentLibrary from './DocumentLibrary';

export default function DocumentEditorMedia(context) {
    const fileInfo = getFileInfo(context);
    const filePath = context.nativescript.fileSystemModule.File.fromPath(fileInfo.Directory + fileInfo.FileName);

    return filePath.read().then((result) => {
        return {
            'content': result,
            'contentType': DocumentLibrary.getDocumentFromBinding(context.binding).MimeType,
        };
    }).catch((error) => {
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryDocuments.global').getValue(),'Error getting binary source: ' + error);
    });
}
