import libCommon from '../Common/Library/CommonLibrary';

export default function ReferenceObjectsEntitySet(context) {
    let headerEntitySetName = libCommon.getEntitySetName(context);

    if (headerEntitySetName === 'S4ServiceOrders' || headerEntitySetName === 'S4ServiceItems' || headerEntitySetName === 'S4ServiceConfirmationItems' || headerEntitySetName === 'S4ServiceQuotations') {
        return context.binding['@odata.readLink'] + '/RefObjects_Nav';
    } else if (headerEntitySetName === 'S4ServiceRequests') {
        return context.binding['@odata.readLink'] + '/RefObj_Nav';
    }

    return context.binding['@odata.readLink'] + '/RefObjects_Nav';
}
