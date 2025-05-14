
export default function EquipDescriptionValue(context) {
    const parentEntity = context.binding['@odata.type'];

    if (parentEntity === '#sap_mobile.S4ServiceRequestRefObj' || parentEntity === '#sap_mobile.S4ServiceConfirmationRefObj') {
        return context.binding.MyEquipment_Nav.EquipDesc;
    } else {
        return context.binding.Equipment_Nav.EquipDesc;
    }
}
