import { GetFirstOpenItemForDocument } from './BulkUpdateLibrary';

export default function GetWBSElement(context) {
    const type = context.binding && context.binding['@odata.type'].substring('#sap_mobile.'.length);
    return GetFirstOpenItemForDocument(context, type, context.binding).then(item => {
        if (item) {
            const itemType = item['@odata.type'].substring('#sap_mobile.'.length);
            if (itemType === 'PurchaseOrderItem' || itemType === 'ReservationItem') 
                return item.WBSElement;
        }
        return '';
    });
}
