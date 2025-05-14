import CommonLibrary from '../Common/Library/CommonLibrary';

export default function S4RelatedHistoryEntitySet(context) {
    const binding = context.getPageProxy().binding;
    const odataType = binding['@odata.type'];
    if (odataType === '#sap_mobile.MyFunctionalLocation' || odataType === '#sap_mobile.MyEquipment') {
        return binding['@odata.readLink'] + getNavLinkBasedOnRelatedType(context);
    } else {
        let readLink = getExistingEquipOrFLocReadLink(binding, odataType);
        return readLink + getNavLinkBasedOnRelatedType(context);
    }
}

function getExistingEquipOrFLocReadLink(binding, odataType) {
    let equipLinkName, flocLinkName;
    if (odataType === '#sap_mobile.S4ServiceRequest' || odataType === '#sap_mobile.S4ServiceConfirmation') {
        equipLinkName = 'MyEquipment_Nav';
        flocLinkName = 'MyFunctionalLocation_Nav';
    } else {
        equipLinkName = 'Equipment_Nav';
        flocLinkName = 'FuncLoc_Nav';
    }

    let refObjects = binding.RefObjects_Nav || binding.RefObj_Nav;
    let refObjWithEquip = refObjects.find(obj => CommonLibrary.isDefined(obj[equipLinkName]));
    let refObjWithFloc = refObjects.find(obj => CommonLibrary.isDefined(obj[flocLinkName]));
    if (refObjWithEquip) {
        return `${refObjWithEquip['@odata.readLink']}/${equipLinkName}`;
    } else if (refObjWithFloc) {
        return `${refObjWithFloc['@odata.readLink']}/${flocLinkName}`;
    }
    return binding['@odata.readLink'];
}

function getNavLinkBasedOnRelatedType(context) {
    const pageBinding = context.getPageProxy().binding;
    switch (pageBinding.RelatedEntity) {
        case 'S4ServiceOrder':
            return '/S4OrderRefObjHistory_Nav';
        case 'S4ServiceRequest':
            return '/S4RequestRefObjHistory_Nav';
        case 'S4ServiceConfirmation':
            return '/S4ConfirmationRefObjHistory_Nav';
        default:
            return '';
    }
}
