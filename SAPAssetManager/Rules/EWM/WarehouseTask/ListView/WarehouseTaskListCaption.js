import ComLib from '../../../Common/Library/CommonLibrary';
import { WarehouseTaskListFilterAndSearchQuery } from './WarehouseTaskListQuery';

export default function WarehouseTaskListCaption(clientAPI) {
    const totalCountQueryOptions = WarehouseTaskListFilterAndSearchQuery(clientAPI, false);
    const countQueryOptions = WarehouseTaskListFilterAndSearchQuery(clientAPI);

    const totalCountPromise = ComLib.getEntitySetCount(clientAPI, 'WarehouseTasks', totalCountQueryOptions);
    const countPromise = ComLib.getEntitySetCount(clientAPI, 'WarehouseTasks', countQueryOptions);

    return Promise.all([countPromise, totalCountPromise]).then(([count, totalCount]) => {
        if (count === totalCount) {
            return clientAPI.localizeText('tasks_x', [totalCount]);
        }
        return clientAPI.localizeText('tasks_x_x', [count, totalCount]);
    });
}
