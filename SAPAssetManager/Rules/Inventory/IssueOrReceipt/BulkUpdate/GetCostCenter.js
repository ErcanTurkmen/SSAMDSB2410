
import { GetFirstOpenItemForDocument } from './BulkUpdateLibrary';

export default function GetCostCenter(context) {
    const type = context.binding && context.binding['@odata.type'].substring('#sap_mobile.'.length);
    if (type === 'ReservationHeader')
        return Promise.resolve(context.binding.CostCenter);
    return GetFirstOpenItemForDocument(context, type, context.binding).then(item => {
        if (item) {
            const itemType = item['@odata.type'].substring('#sap_mobile.'.length);
            if (itemType === 'PurchaseOrderItem') 
                return item.CostCenter;
        }
        return '';
    });
}
