
export default function RelatedCatalogsCount(context) {
    return context.count('/SAPAssetManager/Services/AssetManager.service', `${context.binding['@odata.readLink']}/WCMCatalogs`, '');
}
