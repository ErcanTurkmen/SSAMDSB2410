import libComm from '../../Common/Library/CommonLibrary';

export default function WorkPermitUsageFilterPropertyItems(context) {
    const planningPlant = libComm.getUserDefaultPlanningPlant();
    const filterTerm = planningPlant ? `$filter=PlanningPlant eq '${planningPlant}'&` : '';
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'WCMApplicationUsages', [], `${filterTerm}$select=Usage,DescriptUsage`).then(results => {
        return {
            name: 'Usage',
            values: Array.from(results, r => ({
                ReturnValue: r.Usage,
                DisplayValue: r.DescriptUsage,
            })),
        };
    });
}
