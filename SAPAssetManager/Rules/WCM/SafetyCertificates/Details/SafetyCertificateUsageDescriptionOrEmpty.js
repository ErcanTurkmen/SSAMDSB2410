
export default function SafetyCertificateUsageDescriptionOrEmpty(context) {
    return GetCertificateRelatedUsageType(context, context.binding.Usage);
}

export function GetCertificateRelatedUsageType(context, usageType) {
    if (!usageType) {
        return '';
    }
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'WCMDocumentUsages', [], `$filter=Usage eq '${usageType}'&$select=UsageDescription`)
        .then(wcmDocumentUsages => !!wcmDocumentUsages && wcmDocumentUsages.length ? wcmDocumentUsages.getItem(0).UsageDescription : '')
        .then(usageDescription => usageDescription || '');
}
