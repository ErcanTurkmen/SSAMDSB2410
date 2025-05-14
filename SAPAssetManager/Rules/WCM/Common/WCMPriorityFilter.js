

export default function WCMPriorityFilter(context, returnValuePrefix = '') {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'Priorities', [], '$filter=PriorityType eq \'PM\'&$orderby=Priority').then(priorities => {
        return {
            name: `${returnValuePrefix}Priority`, 
            values:[...new Map(priorities.map(item => [item.Priority, item])).values()]
                .map(p => ({
                    ReturnValue: p.Priority, 
                    DisplayValue: p.PriorityDescription,
                })),
        };
    });
}
