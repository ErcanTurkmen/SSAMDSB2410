
export default function ServiceConfirmationsSectionCount(context) {
    let queryOptions =`$filter=RelatedObjectID eq '${context.binding.ObjectID}'`;
    return context.count('/SAPAssetManager/Services/AssetManager.service', 'S4ServiceConfirmationTranHistories', queryOptions);
}
