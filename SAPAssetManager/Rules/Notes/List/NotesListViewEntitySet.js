
export default function NotesListViewEntitySet(context) {
    const entityType = context.binding?.['@odata.type'];
    if (entityType === context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/S4ServiceOrderPartner.global').getValue() 
            || entityType === context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/S4ServiceRequestPartner.global').getValue()) {
        return `${context.binding['@odata.readLink']}/BusinessPartner_Nav/S4BusinessPartnerLongText_Nav`;
    }

    if (!entityType && context.binding.BusinessPartner_Nav) {
        return `${context.binding.BusinessPartner_Nav['@odata.readLink']}/S4BusinessPartnerLongText_Nav`;
    }   

    return `${context.binding['@odata.readLink']}/LongText_Nav`;
}
