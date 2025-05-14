
export default function S4RelatedHistoryDetailsSectionCaption(context) {
    switch (context.binding['@odata.type']) {
        case '#sap_mobile.S4ServiceOrderRefObjHistory':
            return '$(L,service_order_details)';
        case '#sap_mobile.S4ServiceRequestRefObjHistory':
            return '$(L,service_request_details)';
        case '#sap_mobile.S4ServiceConfirmationRefObjHistory':
            return '$(L,confirmation_details)';
        default:
            return '';
    }
}
