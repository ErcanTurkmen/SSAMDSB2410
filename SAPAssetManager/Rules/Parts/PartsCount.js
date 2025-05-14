
export default function PartsCount(clientAPI) {
    return clientAPI.count('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderComponents', OperationPartsQueryOptions(clientAPI));
}

/** @param {IPageProxy & {binding: MyWorkOrderOperation | MyWorkOrderHeader}} context  */
export function OperationPartsQueryOptions(context) {
    const binding = context.getPageProxy().binding;
    const filterTerm = [binding.OrderId ? `OrderId eq '${binding.OrderId}'` : '', binding.OperationNo ? `OperationNo eq '${binding.OperationNo}'` : ''].filter(i => !!i).join(' and ');
    return filterTerm ? `$filter=${filterTerm}` : '';
}
