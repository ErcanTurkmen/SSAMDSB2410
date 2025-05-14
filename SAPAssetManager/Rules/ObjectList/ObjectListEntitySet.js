
export default function ObjectListEntitySet(context) {
    if (context && !context.binding) {
        return '';
    }

    let objectListNavLinkName = 'WOObjectList_Nav';
    if (context.binding['@odata.type'] === '#sap_mobile.S4ServiceOrder' || context.binding['@odata.type'] === '#sap_mobile.S4ServiceRequest') {
        objectListNavLinkName = 'RefObjects_Nav';
    }
    if (context.binding['@odata.type'] === '#sap_mobile.S4ServiceRequest') {
        objectListNavLinkName = 'RefObj_Nav';
    }
    return context.binding['@odata.readLink'] + '/' + objectListNavLinkName;
}
