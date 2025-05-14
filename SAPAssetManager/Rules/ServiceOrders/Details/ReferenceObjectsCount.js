export default function ReferenceObjectsCount(context) {
    let navLink = '/RefObjects_Nav';
    let equipNavLink = 'Equipment_Nav';
    let flocNavLink = 'FuncLoc_Nav';

    if (context.binding) {
        const entityType = context.binding['@odata.type'];
        
        if (entityType === '#sap_mobile.S4ServiceRequest') {
            navLink = '/RefObj_Nav';
            equipNavLink = 'MyEquipment_Nav';
            flocNavLink = 'MyFunctionalLocation_Nav';
        } else if (entityType === '#sap_mobile.S4ServiceConfirmationItem') {
            equipNavLink = 'MyEquipment_Nav';
            flocNavLink = 'MyFunctionalLocation_Nav';
        }
    }

    return context.count('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'] + navLink, `$filter=sap.entityexists(${equipNavLink}) or sap.entityexists(${flocNavLink}) or sap.entityexists(Material_Nav)`);
}
