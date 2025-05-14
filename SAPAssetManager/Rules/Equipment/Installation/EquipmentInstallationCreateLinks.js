
export default function EquipmentInstallationCreateLinks(context) {
    let links = [];
    if (context.binding['@odata.type'] === '#sap_mobile.MyFunctionalLocation') {
        let equipmentLink = context.createLinkSpecifierProxy('FunctionalLocation', 'MyFunctionalLocations', ''  , context.binding['@odata.readLink']);
        links.push(equipmentLink.getSpecifier());
    }

    return links;
}
