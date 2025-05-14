
import { WAREHOUSE_TASKS_OPEN_FILTER } from './WarehouseTaskListQuery';

export default function WarehouseTaskOpenFilterDisplayValue(clientAPI) {
    const warehouseOrder = clientAPI.getPageProxy().binding?.WarehouseOrder;
    const baseQuery = warehouseOrder ? `WarehouseOrder eq '${warehouseOrder}' and ${WAREHOUSE_TASKS_OPEN_FILTER}` : WAREHOUSE_TASKS_OPEN_FILTER;
    const queryOptions = `$filter=(${baseQuery})`;

    return clientAPI.count('/SAPAssetManager/Services/AssetManager.service', 'WarehouseTasks', queryOptions).then(count => {
        return clientAPI.localizeText('open_ewm_items_x', [count]);
    });
}
