export default function GetGLAccount(context) {
    let type;

    if (context.binding) {
        type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
        if (type === 'MaterialDocItem' || type === 'ReservationItem' || type === 'PurchaseOrderItem') {
            return context.binding.GLAccount;
        }
    }
    return '';
}
