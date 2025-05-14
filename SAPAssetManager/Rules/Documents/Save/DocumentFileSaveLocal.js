import ValidationLibrary from '../../Common/Library/ValidationLibrary';
import writeDocument from '../Save/DocumentSave';
export default function DocumentFileSaveLocal(pageProxy) {
    const mediaReadLinks = pageProxy.getClientData().mediaReadLinks;
    const medias = mediaReadLinks.map(readLink => pageProxy.read('/SAPAssetManager/Services/AssetManager.service', readLink, [], ''));

    return Promise.all(medias)
        .then((/** @type {Array<ObservableArray<Document>>} */ result) => result
            .forEach(documentObs => {
                if (!ValidationLibrary.evalIsEmpty(documentObs)) {
                    writeDocument(pageProxy, documentObs.getItem(0));
                }
            }));
}
