
import { GetFirstOpenItemForDocument } from './BulkUpdateLibrary';
import common from '../../../Common/Library/CommonLibrary';

export default function GetPlantName(context) {
    const type = context.binding && context.binding['@odata.type'].substring('#sap_mobile.'.length);
    let defaultValue = common.getUserDefaultPlant();
    if (type === 'StockTransportOrderHeader') {
        return Promise.resolve(context.binding.SupplyingPlant || defaultValue);
    }
    return GetFirstOpenItemForDocument(context, type, context.binding).then(item => {
        if (item) {
            const itemType = item['@odata.type'].substring('#sap_mobile.'.length);
            if (itemType === 'ReservationItem' || itemType === 'ProductionOrderComponent')
                return item.SupplyPlant || defaultValue;
            return item.Plant || defaultValue; 
        }
        return defaultValue || '';
    });
}
