export default function PartnerDescription(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'WCMPartnerFunctions', [], `$filter=PartnerFunction eq '${context.binding.PartnerFunction}'`)
    .then(desc=>desc.getItem(0).Description);
}
