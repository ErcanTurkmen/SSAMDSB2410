
export default function IsConfirmationDetails(context) {
    return context.binding['@odata.type'] === '#sap_mobile.S4ServiceConfirmationRefObjHistory';
}
