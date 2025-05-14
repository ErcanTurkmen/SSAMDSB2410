import businessPartnerQueryOptions from '../../BusinessPartners/BusinessPartnerQueryOptions';
import contextConverter from './BusinessPartnerContextConverter';

export default function BusinessPartnerDetailsViewNav(context) {
    let binding = context.getPageProxy().getActionBinding();
    let queryOptions = businessPartnerQueryOptions(context);
    let entity = binding['@odata.readLink'];
    let s4Flag = false;

    if (binding['@odata.type'] === '#sap_mobile.Customer') {
        entity = binding['@odata.readLink'] + '/BusinessPartner_Nav';
        queryOptions = '$expand=Address_Nav/AddressCommunication';
        s4Flag = true;
    } else if (binding['@odata.type'] === '#sap_mobile.S4BusinessPartner') {
        queryOptions = '$expand=Address_Nav/AddressCommunication';
        s4Flag = true;
    }

    return context.read('/SAPAssetManager/Services/AssetManager.service', entity, [], queryOptions).then(function(result) {
        if (result.length) {
            let businessPartner = result.getItem(0);
            if (s4Flag) {
                businessPartner = {
                    'S4PartnerFunc_Nav': {},
                    'BusinessPartner_Nav': businessPartner,
                };
            }
            let fakeContext = {binding: businessPartner};
            contextConverter(fakeContext);
            context.getPageProxy().setActionBinding(businessPartner);
        }
       
        return context.executeAction('/SAPAssetManager/Actions/BusinessPartners/BusinessPartnerDetailsViewNav.action');
    });
}
