import AttachedDocumentIcon from '../../Documents/AttachedDocumentIcon';
import Logger from '../../Log/Logger';
import DocumentsBDSCount from '../../Documents/Count/DocumentsBDSCount';
import CommonLibrary from '../../Common/Library/CommonLibrary';
import ValidationLibrary from '../../Common/Library/ValidationLibrary';

export default async function MaterialDocumentIcon(context) {
    const icons = [];
    const binding = context.binding;

    const attachmentIcon = await GetAttachmentIcon(context, binding);
    if (attachmentIcon) {
        icons.push(attachmentIcon);
    }
    const hasLocal = await Promise.all([
        HasLocalDocumentItem(context, binding),
        CommonLibrary.isCurrentReadLinkLocal(binding['@odata.readLink']),
    ]).then(([isLocal, hasLocalItem]) => isLocal || hasLocalItem);

    if (hasLocal) {
        icons.push(CommonLibrary.GetSyncIcon(context));
    }
    return icons;
}

/** @param {MaterialDocument} materialDocument  */
function HasLocalDocumentItem(context, materialDocument) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', `${materialDocument['@odata.readLink']}/RelatedItem`, [], '')
        .then((/** @type {ObservableArray<MaterialDocItem>} */ items) => !ValidationLibrary.evalIsEmpty(items) && items.some(attachment => CommonLibrary.isCurrentReadLinkLocal(attachment['@odata.readLink'])));
}


export async function GetAttachmentIcon(context, binding) {
    return await DocumentsBDSCount(context, binding)
        .then(docsCount => AttachedDocumentIcon(context, undefined, docsCount))
        .catch((error) => {
            Logger.error(`Cannot read MatDocAttachments for MaterialDocument ${binding['@odata.readLink']}`, error);
            return undefined;
        });
}
