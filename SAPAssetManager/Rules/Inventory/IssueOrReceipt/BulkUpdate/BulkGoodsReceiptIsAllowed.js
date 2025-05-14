import {GetOpenItemsQuery} from './BulkUpdateLibrary';

// To allow goods receive all only if there is atleast 1 item that is not completed and open qty is greater tha zero
export default function BulkGoodsReceiptIsAllowed(context, bindingObject) {
    let query;
    let target;
    let openItemsQuery;
    const binding = bindingObject || context.binding;
    if (binding) {
        openItemsQuery = GetOpenItemsQuery('PurchaseOrderItems');
        query = `$filter=(PurchaseOrderId eq '${binding.PurchaseOrderId}') and ${openItemsQuery}`;
        target = 'PurchaseOrderItems';
    } 
    if (query && target) {
        return context.count('/SAPAssetManager/Services/AssetManager.service', target, query).then(function(count) {
            return count > 0;
        });
    } 
    return 0;
}
