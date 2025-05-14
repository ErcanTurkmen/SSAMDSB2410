import PriorityQueryOptions from './PriorityQueryOptions';

export default async function PriorityListPicker(context) {
    const queryOptions = await PriorityQueryOptions(context);
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
