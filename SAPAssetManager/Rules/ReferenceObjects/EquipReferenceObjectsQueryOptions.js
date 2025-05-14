
export default function EquipReferenceObjectsQueryOptions(context) {
    const parentEntity = context.binding['@odata.type'];
    let navLink = 'Equipment_Nav';

    if (parentEntity === '#sap_mobile.S4ServiceRequest' || parentEntity === '#sap_mobile.S4ServiceConfirmationItem') {
        navLink = 'MyEquipment_Nav';
    }

    return `$filter=sap.entityexists(${navLink})&$expand=${navLink}&$orderby=MainObject desc`;
}
