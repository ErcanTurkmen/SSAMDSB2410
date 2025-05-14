export default function InvolvedPartiesCount(context) {
    return context.count('/SAPAssetManager/Services/AssetManager.service', 'WCMApplicationPartners',`$filter=WCMApplication eq '${context.binding.WCMApplication}'`);
}
