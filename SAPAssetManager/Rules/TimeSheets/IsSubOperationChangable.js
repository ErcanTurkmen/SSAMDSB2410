
export default function IsSubOperationChangable(context) {
    let binding = context.getBindingObject();
    return context.count('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderSubOperations', "$orderby=SubOperationNo&$filter=OrderId eq '" + binding.OrderId + "'").then(function(count) {
        return count;
    });
}
