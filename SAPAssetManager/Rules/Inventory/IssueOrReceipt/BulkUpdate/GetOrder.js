
import { GetFirstOpenItemForDocument } from './BulkUpdateLibrary';

export default function GetOrder(context) {
    const type = context.binding && context.binding['@odata.type'].substring('#sap_mobile.'.length);
    return GetFirstOpenItemForDocument(context, type, context.binding).then(item => {
        if (item) {
            const itemType = item['@odata.type'].substring('#sap_mobile.'.length);
            if (itemType === 'ReservationItem' || itemType === 'ProductionOrderComponent')
                return item.OrderId;
            else if (itemType === 'PurchaseOrderItem')
                return item.Order;
        }
        return '';
    });
}
