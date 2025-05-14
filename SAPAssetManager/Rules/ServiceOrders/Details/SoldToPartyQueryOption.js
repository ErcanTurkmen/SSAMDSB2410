
export default function SoldToPartyQueryOption(context) {
    let soldToParty = context?.binding?.SoldToParty;
    let queryBuilder = context.dataQueryBuilder();
    if (context.binding['@odata.type'] === '#sap_mobile.S4ServiceRequest') {
        queryBuilder.expand('S4PartnerFunction_Nav,BusinessPartner_Nav,BusinessPartner_Nav/Customer_Nav,BusinessPartner_Nav/Address_Nav,BusinessPartner_Nav/Address_Nav/AddressCommunication');
    } else {
        queryBuilder.expand('S4PartnerFunc_Nav,BusinessPartner_Nav,BusinessPartner_Nav/Customer_Nav,BusinessPartner_Nav/Address_Nav,BusinessPartner_Nav/Address_Nav/AddressCommunication,S4ServiceOrder_Nav');
    }
    queryBuilder.filter(`BusinessPartnerID eq '${soldToParty}'`);
    queryBuilder.top(1);
    return queryBuilder;
}
