import { MovementTypes } from '../../Common/Library/InventoryLibrary';
import { GetFirstOpenItemForDocument } from './BulkUpdateLibrary';

export default function GetDefaultMovementType(context) {
    // first time ADHOC GI page appears, the WBSElementVisible rule is executed and context.binding is undefined.
    const type = context?.binding?.['@odata.type']?.substring('#sap_mobile.'.length);
    switch (type) {
        case 'PurchaseOrderHeader':
            return MovementTypes.t101;
        case 'ReservationHeader':
            return GetFirstOpenItemForDocument(context, type, context.binding).then((result) => {
                return result.MovementType;
            });
        case 'StockTransportOrderHeader':
            return MovementTypes.t351;
        case 'ProductionOrderHeader':
            return MovementTypes.t261;
    }
    return '';
}
