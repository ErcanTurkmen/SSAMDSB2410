
export default function FLocIDValue(context) {
    const parentEntity = context.binding['@odata.type'];

    if (parentEntity === '#sap_mobile.S4ServiceRequestRefObj' || parentEntity === '#sap_mobile.S4ServiceConfirmationRefObj') {
        return context.binding.MyFunctionalLocation_Nav.FuncLocId;
    } else {
        return context.binding.FuncLoc_Nav.FuncLocId;
    }
}
