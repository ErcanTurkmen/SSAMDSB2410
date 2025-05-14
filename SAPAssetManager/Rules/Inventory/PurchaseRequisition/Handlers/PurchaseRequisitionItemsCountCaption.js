/**
* Get available items count for PR
* @param {IClientAPI} context
*/
export default function PurchaseRequisitionItemsCountCaption(context) {
    const binding = context.binding;
    if (binding) {
        const queryOptions = "$filter=PurchaseReqNo eq '" + context.binding.PurchaseReqNo + "'";
        return context.count('/SAPAssetManager/Services/AssetManager.service', 'PurchaseRequisitionItems', queryOptions).then(count => {
            if (count === 1) {
                return context.localizeText('number_of_items_1_item');
            }
            return context.localizeText('number_of_items',[count]);
        });
    }
    return '';
}
