import WarehouseTaskOpenFilterDisplayValue from './WarehouseTaskOpenFilterDisplayValue';
import { WAREHOUSE_TASKS_OPEN_FILTER } from './WarehouseTaskListQuery';
/**
* This function sets default filter for Warehouse Tasks
* @param {IClientAPI} context
*/
export default function GetWarehouseTaskPreselectedFilter(context) {
    return [context.createFilterCriteria(context.filterTypeEnum.Filter, 'OpenTasks', [WarehouseTaskOpenFilterDisplayValue(context)],[WAREHOUSE_TASKS_OPEN_FILTER], true)];
}
