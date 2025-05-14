export default async function PriorityOptions(context) {
    const result = await context.read('/SAPAssetManager/Services/AssetManager.service', 'Priorities', [], '$orderby=PriorityDescription');
    const prioritiesList = [];
    result.forEach((priority) => {
        if (!prioritiesList.find(item => priority.Priority === item.ReturnValue)) {
            prioritiesList.push({
                'DisplayValue': `${priority.PriorityDescription}(${priority.PriorityType})`,
                'ReturnValue': `${priority.Priority}' and PriorityType eq '${priority.PriorityType}`,
            });
        }
    });
    return prioritiesList;
}
