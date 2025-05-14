
export default function SetServiceConfirmationAmountValue(context) {
    if (context.binding && context.binding['@odata.type'] === '#sap_mobile.S4ServiceItem') {
        return context.binding.NetValue;
    } else if (context.binding && context.binding['@odata.type'] === '#sap_mobile.S4ServiceConfirmationItem') {
        return context.binding.Amount;
    }

    return '';
}
