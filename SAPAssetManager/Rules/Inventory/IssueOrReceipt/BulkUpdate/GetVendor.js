
export default function GetVendor(context) {
    const type = context.binding && context.binding['@odata.type'].substring('#sap_mobile.'.length);
    return type === 'PurchaseOrderHeader' ? context.binding.Vendor : '';
}
