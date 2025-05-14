
export default function S4RelatedHistoryDetailsPageCaption(context) {
    let caption;
    switch (context.binding['@odata.type']) {
        case '#sap_mobile.S4ServiceOrderRefObjHistory':
            caption = 'related_service_order';
            break;
        case '#sap_mobile.S4ServiceRequestRefObjHistory':
            caption = 'related_service_request';
            break;
        case '#sap_mobile.S4ServiceConfirmationRefObjHistory':
            caption = 'related_confirmation';
            break;
        default:
            caption = '';
            break;
    }
    return `${context.localizeText(caption)} ${context.binding.ObjectID}`;
}
