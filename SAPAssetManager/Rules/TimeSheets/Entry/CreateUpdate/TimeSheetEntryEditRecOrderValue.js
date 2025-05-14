
export default function TimeSheetEntryEditRecOrderValue(context) {
    if (context.binding.OrderId) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', `MyWorkOrderHeaders('${context.binding.OrderId}')`, [], '').then(function(results) {
            if (results && results.length > 0) {
                return results.getItem(0)['@odata.readLink'];
            }
            return '';
        });
    } else {
        return context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'] + '/MyWOHeader', [], '').then(function(results) {
            if (results && results.length > 0) {
                return results.getItem(0)['@odata.readLink'];
            }
            return '';
        });
    }
}
