export default function FormatLocation(context) {
    if (context.binding?.MaintPlant && context.binding?.Location) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', `Locations(Plant='${context.binding.MaintPlant}', Location='${context.binding.Location}')`, [], '').then(function(result) {
            if (result && result.getItem(0)) {
                return result.getItem(0).LocationName;
            } 
            return '-';
        }, function() {
            return '-';
        });
    }
    return Promise.resolve('-');
}
