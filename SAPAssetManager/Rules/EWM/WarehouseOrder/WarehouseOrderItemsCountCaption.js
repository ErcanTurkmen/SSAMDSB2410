import { WO_OPEN_FILTER, WO_CONFIRMED_FILTER } from './WarehouseOrderListQueryOptions';

/**
* @param {IClientAPI} clientAPI
*/
export default function WarehouseOrderItemsCountCaption(context) {
    //display all the warehouseorders with status open and confirmed
    let filter = `$filter=(${WO_OPEN_FILTER}) or (${WO_CONFIRMED_FILTER})`;
    return context.count('/SAPAssetManager/Services/AssetManager.service', 'WarehouseOrders', filter).then(count => {
          return context.localizeText('ewm_wo_items_x', [count]);
    });   
}
