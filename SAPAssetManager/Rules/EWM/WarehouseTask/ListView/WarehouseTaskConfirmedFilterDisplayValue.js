import { WAREHOUSE_TASKS_CONFIRMED_FILTER } from './WarehouseTaskListQuery';

export default function WarehouseTaskConfirmedFilterDisplayValue(clientAPI) {
    const warehouseOrder = clientAPI.getPageProxy().binding?.WarehouseOrder;
    const baseQuery = warehouseOrder ? `WarehouseOrder eq '${warehouseOrder}' and ${WAREHOUSE_TASKS_CONFIRMED_FILTER}` : WAREHOUSE_TASKS_CONFIRMED_FILTER;
    const queryOptions = `$filter=(${baseQuery})`;

    return clientAPI.count('/SAPAssetManager/Services/AssetManager.service', 'WarehouseTasks', queryOptions).then(count => {
        return clientAPI.localizeText('confirmed_ewm_items_x', [count]);
    });
}    
