import libDoc from '../DocumentLibrary';

export default function DownloadDocumentsNav(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', `${context.binding['@odata.readLink']}`, [], libDoc.getExpandQueryForDownloadDocumentsNav(context, context.binding['@odata.type']))
        .then(parentItemResult => {
            const item = parentItemResult.getItem(0);

            return libDoc.getDocumentsListForDownload(context, item).then(results => {
                let documentsList = [];
                results.forEach(result => {
                    if (result.isMainObject && result.documents && result.documents.length) {
                        documentsList.push({
                            'type': 'MAIN',
                            'ids': [],
                            'documents': result.documents._array || [],
                        });
                    } else if (result.documents && result.documents.length) {
                        documentsList.push({
                            'type': getType(result),
                            'ids': result.ids || [],
                            'documents': result.documents._array || [],
                        });
                    }
                });

                // store documents list in client data to use it on download documents page to avoid read documents list again
                context.getPageProxy().getClientData().documentsList = documentsList;
                item.documentsList = documentsList;
                context.setActionBinding(item);

                return context.executeAction('/SAPAssetManager/Actions/Documents/DownloadDocumentsNav.action');
            });
        });
}

function getType(result) {
    let type = 'OPERATIONS';
    if (result.parentEntitySet.includes('Equip')) type = 'EQUIPMENT';
    else if (result.parentEntitySet.includes('Func')) type = 'FLOC';
    else if (result.parentEntitySet.includes('Item')) type = 'ITEMS';
    return type;
}
