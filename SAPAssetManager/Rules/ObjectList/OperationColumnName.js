
export default function OperationColumnName(context) {
    if (context.binding && context.binding.length && 
        context.binding.getItem(0)['@odata.type'] === '#sap_mobile.S4ServiceOrderRefObj') { 
        return context.localizeText('service_item');
    }

    return context.localizeText('operation');
}
