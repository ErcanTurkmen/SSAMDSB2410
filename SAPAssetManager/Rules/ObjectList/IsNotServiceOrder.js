
export default function IsNotServiceOrder(context) {
    return context.binding && context.binding['@odata.type'] !== '#sap_mobile.S4ServiceOrderRefObj';
}
