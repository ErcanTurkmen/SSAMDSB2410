
export default function ServicePriorities(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'ServicePriorities', [], '$orderby=Priority')
        .then(servicePriorities => [...new Map(servicePriorities.map((/** @type {ServicePriority} */ item) => [item.Priority, item])).values()])
        .then((/** @type {ServicePriority[]} */ servicePriorities) => ({
            name: 'Priority',
            values: servicePriorities.map(item => ({
                ReturnValue: item.Priority,
                DisplayValue: `${item.Priority} - ${item.Description}` || '-',
            })),
        }));
}
