import libCommon from '../../../Common/Library/CommonLibrary';

const TASK_ARRAY = 'WAREHOUSE_ORDER_TASKS';

/**
 * Save the Tasks of the Warehouse Order
 * @param {IClientAPI} context 
 * @returns array of tasks
 */
export function SaveTasksToPageData(pageProxy) {
    const taskArray = [];
    // Check if the context has a binding for the array
    if (pageProxy && pageProxy.binding && Array.isArray(pageProxy.binding?.WarehouseTask_Nav)) {
        pageProxy.binding?.WarehouseTask_Nav.forEach(element => {
            taskArray.push(element);
        });
    } else {
        // If the binding is not available, then fetch the data from the service
        pageProxy.read('/SAPAssetManager/Services/AssetManager.service', 'WarehouseTasks', ['WarehouseOrder','WarehouseTask'], '$orderby=WarehouseOrder,WarehouseTask').then((result) => {
            if (result) {
                result.forEach(element => {
                    taskArray.push(element);
                });
            }
        });
    }
    libCommon.setStateVariable(pageProxy, TASK_ARRAY, taskArray);
}

/**
 * Reset Tasks in the Page Data
 * @param {*} pageProxy 
 */
export function ResetTasksInPageData(pageProxy) {
    libCommon.removeStateVariable(pageProxy, TASK_ARRAY);
}

/**
 * Is the task first in the list
 * @param {IClientAPI}context 
 * @param {string} taskId 
 * @returns 
 */
export function IsFirst(context, taskId) {
    const taskArray = libCommon.getStateVariable(context, TASK_ARRAY);
    if (taskArray && taskArray.length > 0) {
        return taskArray.at(0).WarehouseTask === taskId;
    }
    return true;
}

/**
 * Is the task last in the list
 * @param {IClientAPI}context 
 * @param {string} taskId 
 * @returns 
 */
export function IsLast(context, taskId) {
    const taskArray = libCommon.getStateVariable(context, TASK_ARRAY);
    if (taskArray && taskArray.length > 0) {
        return taskArray.at(taskArray.length - 1).WarehouseTask === taskId;
    }
    return true;
}

/**
 * Is the task last in the list
 * @param {IClientAPI}context 
 * @param {string} taskId 
 * @returns 
 */
export function GetNextPreviousTask(context, taskId, next = true) {
    const taskArray = libCommon.getStateVariable(context, TASK_ARRAY);
    if (taskArray && taskArray.length > 0) {
        const index = taskArray.findIndex(element => element.WarehouseTask === taskId);
        return taskArray.at(index + (next ? 1 : -1));
    }
    return undefined;
}


