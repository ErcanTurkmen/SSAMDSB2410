import { VendorVisible } from './BulkUpdateLibrary';

export default function IsVendorVisible(context, specialStockIndicator = '') {
    const type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
    return ((type === 'PurchaseOrderHeader') && VendorVisible.SpecialStockInd.includes(specialStockIndicator));
}
