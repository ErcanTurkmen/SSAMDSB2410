import ValidationLibrary from '../Common/Library/ValidationLibrary';

// eslint-disable-next-line no-unused-vars
export default function S4MapQueryOptions(context, extraFiltering) {
    let expand = '$expand=MobileStatus_Nav,Partners_Nav/BusinessPartner_Nav/Address_Nav/AddressGeocode_Nav/Geometry_Nav,' +
        'Partners_Nav/S4PartnerFunc_Nav,' +
        'RefObjects_Nav/Equipment_Nav/Address/AddressGeocode_Nav/Geometry_Nav,' + 
        'RefObjects_Nav/FuncLoc_Nav/Address/AddressGeocode_Nav/Geometry_Nav';

    let filter = '$filter=(sap.entityexists(RefObjects_Nav/Equipment_Nav/Address/AddressGeocode_Nav/Geometry_Nav) or ' +
        'sap.entityexists(Partners_Nav/BusinessPartner_Nav/Address_Nav/AddressGeocode_Nav/Geometry_Nav) or ' +
        'sap.entityexists(RefObjects_Nav/FuncLoc_Nav/Address/AddressGeocode_Nav/Geometry_Nav))';

    if (!ValidationLibrary.evalIsEmpty(extraFiltering)) {
        filter += ' and ' + extraFiltering;
    }

    return expand + '&' + filter;
}
