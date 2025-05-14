import { GetFirstOpenItemForDocument } from './BulkUpdateLibrary';

export default function GetActivityNumber(context) {
    const type = context.binding && context.binding['@odata.type'].substring('#sap_mobile.'.length);
    return GetFirstOpenItemForDocument(context, type, context.binding).then(item => {
        if (item) {
            const itemType = item['@odata.type'].substring('#sap_mobile.'.length);
            if (itemType === 'PurchaseOrderItem') 
                return item.NetworkActivity;
            else if (itemType === 'ReservationItem')
                return item.ActivityNum;
        }
        return '';
    });
}
