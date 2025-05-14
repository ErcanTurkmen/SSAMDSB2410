
export default function PurchaseRequisitionListPageTitle(context) {
    return context.count('/SAPAssetManager/Services/AssetManager.service', 'PurchaseRequisitionHeaders', '')
        .then(count => context.localizeText('purchase_requisitions_x', [count]));
}
