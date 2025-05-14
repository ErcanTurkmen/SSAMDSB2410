
export default function ServiceItemTableEntitySet(context) {
    if (context.binding?.['@odata.type'] === '#sap_mobile.S4ServiceItem') {
        return 'S4ServiceItems';
    } else if (context.binding) {
        return `${context.binding?.['@odata.readLink']}/ServiceItems_Nav`;
    }

    return 'S4ServiceItems';
}
