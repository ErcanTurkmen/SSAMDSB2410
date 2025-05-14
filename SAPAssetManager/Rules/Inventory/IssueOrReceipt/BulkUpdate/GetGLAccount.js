
import { GetFirstOpenItemForDocument } from './BulkUpdateLibrary';

export default function GetGLAccount(context) {
    const type = context.binding && context.binding['@odata.type'].substring('#sap_mobile.'.length);
    return GetFirstOpenItemForDocument(context, type, context.binding).then(item => {
        if (item) {
            const itemType = item['@odata.type'].substring('#sap_mobile.'.length);
            if (itemType === 'ReservationItem' || itemType === 'PurchaseOrderItem') 
                return item.GLAccount;
        }
        return '';
    });
}

