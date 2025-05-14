export default function DocumentAddEditEntitySetReadLink(context) {
    let binding = context.binding;
    let odataType = binding['@odata.type'];
    let readLink = '';
    if (odataType === '#sap_mobile.InspectionCharacteristic' || odataType === '#sap_mobile.InspectionPoint') {
        readLink = `InspectionLots('${binding.InspectionLot}')`;
    } else if (odataType === '#sap_mobile.MyWorkOrderOperation') {
        readLink = binding.WOHeader['@odata.readLink'] + '/InspectionLot_Nav';
    } else if (odataType === '#sap_mobile.EAMChecklistLink') {
        readLink = binding['@odata.readLink'] + '/InspectionLot_Nav';
    }

    if (readLink) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', readLink, [], '').then(result => {
            if (result && result.length > 0) {
                return result.getItem(0)['@odata.readLink'];
            }
            return '';
        });
    }

    return binding['@odata.readLink'];
}
