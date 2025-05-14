
export default function FLocDescriptionValue(context) {
    const parentEntity = context.binding['@odata.type'];

    if (parentEntity === '#sap_mobile.S4ServiceRequestRefObj' || parentEntity === '#sap_mobile.S4ServiceConfirmationRefObj') {
        return context.binding.MyFunctionalLocation_Nav.FuncLocDesc;
    } else {
        return context.binding.FuncLoc_Nav.FuncLocDesc;
    }
}
