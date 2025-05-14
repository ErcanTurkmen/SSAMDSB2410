
export default class AddressesUtil {
    static filterAddressesBySequences(sequences, item) {
        let geometry = '';

        sequences.some(sequence => {
            let addressSrc = sequence.SrcObjectTechEntityType;
            let addressObj = sequence.SrcObjectType;

            switch (addressSrc) {
                case 'WOPARTNER': {
                    let partners = item.WOPartners;
                    let findPartner = partners.find(partner => {
                        return partner.PartnerFunction === addressObj && this._checkAddressGeometryExist(partner.Address_Nav);
                    });
    
                    if (findPartner) {
                        geometry = findPartner.Address_Nav.AddressGeocode_Nav.Geometry_Nav.GeometryValue;
                        item.address = findPartner.Address_Nav;
                    }
                    break;
                }
                case 'WOHEADER': {
                    if (this._checkAddressGeometryExist(item.Address)) {
                        geometry = item.Address.AddressGeocode_Nav.Geometry_Nav.GeometryValue;
                        item.address = item.Address;
                    }
                    break;
                }
                case 'EQUIPMENT': {
                    if (item.Equipment && this._checkAddressGeometryExist(item.Equipment.Address)) {
                        geometry = item.Equipment.Address.AddressGeocode_Nav.Geometry_Nav.GeometryValue;
                        item.address = item.Equipment.Address;
                    }
                    if (item.RefObjects_Nav) {
                        let objects = item.RefObjects_Nav;
                        let equipmentWithGeometry = objects.find(object => {
                            return object.EquipID && object.Equipment_Nav && object.Equipment_Nav.Address && 
                                this._checkAddressGeometryExist(object.Equipment_Nav.Address);
                        });

                        if (equipmentWithGeometry) {
                            geometry = equipmentWithGeometry.Equipment_Nav.Address.AddressGeocode_Nav.Geometry_Nav.GeometryValue;
                            item.address = equipmentWithGeometry.Equipment_Nav.Address;
                        }
                    }
                    break;
                }
                case 'FUNCLOC': {
                    if (item.FunctionalLocation && this._checkAddressGeometryExist(item.FunctionalLocation.Address)) {
                        geometry = item.FunctionalLocation.Address.AddressGeocode_Nav.Geometry_Nav.GeometryValue;
                        item.address = item.FunctionalLocation.Address;
                    }
                    if (item.RefObjects_Nav) {
                        let objects = item.RefObjects_Nav;
                        let flocWithGeometry = objects.find(object => {
                            return object.FLocID && object.FuncLoc_Nav && object.FuncLoc_Nav.Address && 
                                this._checkAddressGeometryExist(object.FuncLoc_Nav.Address);
                        });

                        if (flocWithGeometry) {
                            geometry = flocWithGeometry.FuncLoc_Nav.Address.AddressGeocode_Nav.Geometry_Nav.GeometryValue;
                            item.address = flocWithGeometry.FuncLoc_Nav.Address;
                        }
                    }
                    break;
                }
                case 'BUSPARTNER': {
                    let partners = item.Partners_Nav;
                    let findPartner = partners.find(partner => {
                        return partner.S4PartnerFunc_Nav && partner.S4PartnerFunc_Nav.ShortDescription === addressObj && partner.BusinessPartner_Nav &&
                            this._checkAddressGeometryExist(partner.BusinessPartner_Nav.Address_Nav);
                    });
    
                    if (findPartner) {
                        geometry = findPartner.BusinessPartner_Nav.Address_Nav.AddressGeocode_Nav.Geometry_Nav.GeometryValue;
                        item.address = findPartner.BusinessPartner_Nav.Address_Nav;
                    }
                    break;
                }
                default: break;
            }

            return !!geometry;
        });
    
        item.geometry = this.checkGeometryValue(geometry);

        return item;
    }

    static _checkAddressGeometryExist(address) {
        return address && address.AddressGeocode_Nav && address.AddressGeocode_Nav.Geometry_Nav 
            && address.AddressGeocode_Nav.Geometry_Nav.GeometryValue;        
    }

    static checkGeometryValue(geometry) {
        if (geometry && !geometry.includes('"x":,') && !geometry.includes('"y":,')) {
            return geometry;
        }

        return '';
    }    
}
