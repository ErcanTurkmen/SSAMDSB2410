
export default function S4BusinessPartnerLinks(context) {
    const links = [
        {
            'Property': 'BusinessPartner_Nav',
            'Target': {
                'EntitySet': 'S4BusinessPartners',
                'ReadLink': '#Control:BusinessPartnerListPicker/#SelectedValue',
            },
        },
        {
            'Property': 'S4PartnerFunc_Nav',
            'Target': {
                'EntitySet': 'S4PartnerFunctions',
                'ReadLink': '#Control:BusinessPartnerTypeListPicker/#SelectedValue',
            },
        },
    ];

    const isOnPartner = context.binding['@odata.type'] === '#sap_mobile.S4ServiceOrderPartner';
    let orderOrItem = context.binding;

    if (context.binding.ItemNo && context.binding.ItemNo !== '000000') {
        if (isOnPartner) {
            orderOrItem = context.binding.S4ServiceItem_Nav;
        }

        links.push({
            'Property': 'S4ServiceItem_Nav',
            'Target': {
                'EntitySet': 'S4ServiceItems',
                'ReadLink': orderOrItem?.['@odata.readLink'],
            },
        });
    } else {
        if (isOnPartner) {
            orderOrItem = context.binding.S4ServiceOrder_Nav;
        }

        links.push({
            'Property': 'S4ServiceOrder_Nav',
            'Target': {
                'EntitySet': 'S4ServiceOrders',
                'ReadLink': orderOrItem?.['@odata.readLink'],
            },
        });
    }

    return links;
}
