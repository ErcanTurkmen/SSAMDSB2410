
export default function FLocReferenceObjectsQueryOptions(context) {
    const parentEntity = context.binding['@odata.type'];
    let navLink = 'FuncLoc_Nav';
    
    if (parentEntity === '#sap_mobile.S4ServiceRequest' || parentEntity === '#sap_mobile.S4ServiceConfirmationItem') {
        navLink = 'MyFunctionalLocation_Nav';
    }

    return `$filter=sap.entityexists(${navLink})&$expand=${navLink}&$orderby=MainObject desc`;
}
