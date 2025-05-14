
export default function IsOrderOrRequestDetails(context) {
    return context.binding['@odata.type'] === '#sap_mobile.S4ServiceOrderRefObjHistory' ||
        context.binding['@odata.type'] === '#sap_mobile.S4ServiceRequestRefObjHistory';
}
