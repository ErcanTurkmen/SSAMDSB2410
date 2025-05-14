import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function IsDiscardButtonVisibleForPRItem(context) {
    if (!CommonLibrary.IsOnCreate(context) && CommonLibrary.isCurrentReadLinkLocal(context.binding['@odata.readLink'])) {
        let purchaseReqNo = context.binding.PurchaseReqNo;
        let itemQueryOptions = `$filter=PurchaseReqNo eq '${purchaseReqNo}'`;

        return context.count('/SAPAssetManager/Services/AssetManager.service', 'PurchaseRequisitionItems', itemQueryOptions)
            .then(count => {
                return (count > 1); //Can only delete if not the last item
            });    
    }

    return Promise.resolve(false);
}
