
export default function CommitS4BusinessPartner(context) {
    if (context.binding?.['@odata.type'] === '#sap_mobile.S4ServiceRequest') {
        return context.executeAction('/SAPAssetManager/Actions/BusinessPartners/S4/S4ServiceRequestBusinessPartnerCreate.action');
    } else {
        return context.executeAction('/SAPAssetManager/Actions/BusinessPartners/S4/S4ServiceOrderBusinessPartnerCreate.action');
    }
}
