
export default function IsServiceOrderFieldEditable(context) {
    let isEditable = true;

    const bindingType = context?.binding?.['@odata.type'];
    if (bindingType === '#sap_mobile.S4ServiceItem' || 
        bindingType === '#sap_mobile.S4ServiceOrder' || 
        bindingType === '#sap_mobile.S4ServiceQuotationItem') { 
        isEditable = !context.binding.ObjectID;
    }

    return isEditable;
}
