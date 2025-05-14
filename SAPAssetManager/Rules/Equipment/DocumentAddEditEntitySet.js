export default function DocumentAddEdit(context) {
    let binding = context.binding;
    let odataType = binding['@odata.type'];
    if (odataType === '#sap_mobile.MyEquipment') {
        return 'MyEquipments';
    } else if (odataType === '#sap_mobile.MyFunctionalLocation') {
        return 'MyFunctionalLocations';
    } else if (odataType === '#sap_mobile.EAMChecklistLink') {
        return 'EAMChecklistLinks';
    } else if (odataType === '#sap_mobile.InspectionLot' || odataType === '#sap_mobile.InspectionCharacteristic' || odataType === '#sap_mobile.MyWorkOrderOperation' || odataType === '#sap_mobile.InspectionPoint') {
        return 'InspectionLots';
    }
}
