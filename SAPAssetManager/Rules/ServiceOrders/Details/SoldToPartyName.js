import ValidationLibrary from '../../Common/Library/ValidationLibrary';

export default function SoldToPartyName(context) {
    let name = context.binding.Name1;

    if (context.binding['@odata.type'] === '#sap_mobile.S4BusinessPartner') {
        name = context.binding.OrgName1 + ' ' + context.binding.OrgName2;
        if (ValidationLibrary.evalIsEmpty(name.trim())) {
            name = context.binding.FirstName + ' ' + context.binding.LastName;
        }
    }

    if (ValidationLibrary.evalIsEmpty(name.trim()) && !ValidationLibrary.evalIsEmpty(context.binding.Address_Nav)) {
        name = context.binding.Address_Nav.FirstName + ' ' + context.binding.Address_Nav.LastName;
    }

    return name;
}
