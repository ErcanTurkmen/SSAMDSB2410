export default function DiscardReadings(context, replaceBinding) {
    if (context.getPageProxy) {
        context = context.getPageProxy();
    }
    const binding = replaceBinding || context.binding;
    let navPath = binding['@odata.readLink'];
    if (binding['@odata.type'] === '#sap_mobile.OrderISULink') {
        navPath += '/Device_Nav/MeterReadings_Nav';
    } else {
        navPath += '/MeterReadings_Nav';
    }
    return deleteReadings(context, navPath);
}

function deleteReadings(context, navPath) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', navPath, [], '$expand=Device_Nav&$filter=sap.islocal()').then(function(result) {
        if (result && result.length > 0) {
            context.getClientData().binding = result.getItem(0);
            return context.executeAction('/SAPAssetManager/Actions/Meters/CreateUpdate/MeterReadingsDiscard.action').then(function() {
                return deleteReadings(context, navPath);
            });
        } else {
            return Promise.resolve();
        }
    });
}
