
export default function RelatedCertificatesData(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', `${context.binding['@odata.readLink']}/WCMApplicationDocuments`, [], '$expand=WCMDocumentHeaders')
        .then(data => Array.from(data, i => i.WCMDocumentHeaders)
            .filter(i => i !== undefined));
}
