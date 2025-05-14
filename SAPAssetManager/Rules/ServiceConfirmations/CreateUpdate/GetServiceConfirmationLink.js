import ServiceConfirmationLibrary from './ServiceConfirmationLibrary';

export default function GetServiceConfirmationLink(context) {
    if (context.binding && context.binding['@odata.type'] === '#sap_mobile.S4ServiceConfirmation') {
        return context.binding['@odata.readLink'];
    }

    return ServiceConfirmationLibrary.getInstance().getConfirmationLink();
}
