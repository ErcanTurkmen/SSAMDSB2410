import DocumentLibrary from './DocumentLibrary';
import CommonLibrary from '../Common/Library/CommonLibrary';
import Logger from '../Log/Logger';

export default async function InitializeAttachmentsDescription(context) {
    if (CommonLibrary.IsOnCreate(context)) {
        return Promise.resolve('');
    }
    
    const attachments = await readBindingObjectDocuments(context);
    if (!attachments.length) return '';

    const localDocument = attachments.find(attachment => attachment['@sap.isLocal']);
    return localDocument && localDocument.Document ? localDocument.Document.Description : '';
}

function readBindingObjectDocuments(context) {
    let objectQueryDetails = DocumentLibrary.getDocumentObjectDetail(context);
    if (objectQueryDetails?.length) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', objectQueryDetails[0].entitySet, [], objectQueryDetails[0].queryOption)
            .catch(error => {
                Logger.error('InitializeAttachmentsDescription', error);
                return [];
            });
    }

    return [];
}
