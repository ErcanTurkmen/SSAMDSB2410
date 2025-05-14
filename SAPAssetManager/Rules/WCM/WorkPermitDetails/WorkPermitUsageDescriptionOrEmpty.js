
export default function WorkPermitUsageDescriptionOrEmpty(context) {
    return GetWorkPermitUsageType(context, context.binding.Usage);
}

function GetWorkPermitUsageType(context, usageType) {
    if (!usageType) {
        return '';
    }
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'WCMApplicationUsages', [], `$filter=Usage eq '${usageType}'&$select=DescriptUsage`)
        .then(wcmApplicationUsages => !!wcmApplicationUsages && wcmApplicationUsages.length ? wcmApplicationUsages.getItem(0).DescriptUsage : '')
        .then(usageDescription => usageDescription || '');
}
