export default function DiscardGoodsMovement(context, replaceBinding) {
    if (context.getPageProxy) {
        context = context.getPageProxy();
    }
    const binding = replaceBinding || context.binding;
    let navPath = binding['@odata.readLink'];
    if (binding['@odata.type'] === '#sap_mobile.OrderISULink') {
        navPath += '/Device_Nav/GoodsMovement_Nav';
    } else {
        navPath += '/GoodsMovement_Nav';
    }
    return deleteGoodsMovement(context, navPath);
}

function deleteGoodsMovement(context, navPath) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', navPath, [], '$expand=Device_Nav&$filter=sap.islocal()').then(function(result) {
        if (result && result.length > 0) {
            context.getClientData().binding = result.getItem(0);
            return context.executeAction('/SAPAssetManager/Actions/Meters/CreateUpdate/MeterGoodsMovementDiscard.action').then(function() {
                return deleteGoodsMovement(context, navPath);
            });
        } else {
            return Promise.resolve();
        }
    });
}
