import { WorkOrderEventLibrary as LibWoEvent } from '../WorkOrderLibrary';

/**
* Returns list of unique Priorities
* @param {IClientAPI} context MDK context
* @param {queryString} string Query options string
*/
export default async function WorkOrderCreateUpdatePrioritiesList(context, queryString) {
    
    const queryOptions = queryString ? queryString : await LibWoEvent.createUpdateControlsQueryOptions(context);
    const result = await context.read('/SAPAssetManager/Services/AssetManager.service', 'Priorities', [], queryOptions);

    const prioritiesList = [];
    result.forEach((priority) => {
        if (!prioritiesList.find(item => priority.Priority === item.ReturnValue)) {
            prioritiesList.push({
                'DisplayValue': priority.PriorityDescription,
                'ReturnValue': priority.Priority,
            });
        }
    });

    return prioritiesList;
}
