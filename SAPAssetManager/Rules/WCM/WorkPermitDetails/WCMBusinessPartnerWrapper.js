import libVal from '../../Common/Library/ValidationLibrary';

export class WCMBusinessPartnerWrapper {

    constructor(entity) {
        this.entity = entity;
        this.partnerType = '';
        
        if (entity.WCMPartnerFunction_Nav) {
            this.partnerType = entity.WCMPartnerFunction_Nav.PartnerType;
        }
    }

    nameEntity() {
        switch (this.partnerType) {
            case 'LI':
            case 'KU': 
            case 'AP':
                return this.entity.BusinessPartner_Nav;
            case 'US': //For contact and user, the AddressAtWork_Nav EntitySet
                return this.entity.AddressAtWork_Nav;
            case 'PE': //For Employee, the Employee_Nav EntitySet
                return this.entity.Employee_Nav;
            default:
                // Throw unrecognized entity error?
                break;
        }
        return null;
    }

    addressEntity() {
        let addressEntity;
        switch (this.partnerType) {
            case 'LI':
            case 'KU': 
            case 'AP':
                addressEntity = this.entity.BusinessPartner_Nav.Address;
                break;
            case 'US': //For contact and user, the AddressAtWork_Nav EntitySet
                addressEntity = this.entity.AddressAtWork_Nav;
                break;
            case 'PE': 
                addressEntity = this.entity.Address_Nav;
                break;
            default:
                // Throw unrecognized entity error?
                break;
        }
        if (addressEntity === undefined) {
            return null;
        }
        return addressEntity;
    }


    nameProperty(property) {
        // determine property key
        let propertyMap = {
            'Name': 'Name',
            'First': 'FirstName',
            'Last': 'LastName',
            'UserName':'UserName',
            'UsName':'SAPUser_Nav',
        };
        let key = propertyMap[property];
        let entity = this.nameEntity();
        return entity ? entity[key] : '';
    }

    addressProperty(property) {
        // determine property key
        let propertyMap = {
            'Street': 'Street',
            'City': 'City',
            'PostalCode': 'PostalCode',
            'Country': 'Country',
            'Building': 'Building',
            'Floor': 'Floor',
            'Room': 'RoomNum',
        };
        if (propertyMap[property] === undefined) {
            // Empty key, must be a unique one
            switch (this.partnerType) {
                case 'LI':
                case 'KU': 
                case 'AP':
                case 'US': //For contact and user, the AddressAtWork_Nav EntitySet
                    propertyMap = {
                        'Region': 'Region',
                        'House': 'HouseNum',
                        'PersonNum': 'PersonNum',
                    };
                    break;
                case 'PE': //For Employee, the Employee_Nav EntitySet
                    propertyMap = {
                        'Region': 'District',
                        'PersonNum': 'PersonnelNum',
                    };
                    break;
                default:
                    // Throw unrecognized entity error?
                    return null;
            }
        }

        let key = propertyMap[property];
        let addressEntity = this.addressEntity();
        if (key === undefined || addressEntity === null) {
            return null;
        }
        return addressEntity[key];
    }

    name() {
        // Retrieve the complex name
        let name = this.nameProperty('Name');
        if (libVal.evalIsEmpty(name)) {
            // TODO: localize
            name = this.nameProperty('First') + ' ' + this.nameProperty('Last')+' '+`(${this.nameProperty('UserName')})`;
        }
        if (!libVal.evalIsEmpty(this.nameProperty('Name'))&&this.nameProperty('UsName')[0].UserName) {
            // TODO: localize
            name = name + ' '+ `(${this.nameProperty('UsName')[0].UserName})`;
        }
        if (name === ' ') {
            name = this.entity.BusinessPartnerID || '-';
        }
        return name;
    }

    address() {
        let parts = [];

        let house = this.addressProperty('House');
        let street = this.addressProperty('Street');

        if (!libVal.evalIsEmpty(house)) parts.push(house);
        if (!libVal.evalIsEmpty(street)) parts.push(street);

        let city = this.addressProperty('City');
        let region = this.addressProperty('Region');
        let zip = this.addressProperty('PostalCode');

        if (!libVal.evalIsEmpty(city)) {
            parts.push(city);
            if (!libVal.evalIsEmpty(region) || !libVal.evalIsEmpty(zip)) {
                parts.push(',');
            }
        } 
        if (!libVal.evalIsEmpty(region)) {
            parts.push(region);
        }
        if (!libVal.evalIsEmpty(zip)) parts.push(zip);

        let country = this.addressProperty('Country');
        if (!libVal.evalIsEmpty(country)) parts.push(country);

        return parts.join(' ');
    }

}
