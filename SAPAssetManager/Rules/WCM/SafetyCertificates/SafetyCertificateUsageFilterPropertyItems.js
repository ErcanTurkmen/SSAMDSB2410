import libComm from '../../Common/Library/CommonLibrary';

export default function SafetyCertificateUsageFilterPropertyItems(context) {
    const planningPlant = libComm.getUserDefaultPlanningPlant();
    const filterTerm = planningPlant ? `$filter=PlanningPlant eq '${planningPlant}'&` : '';
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'WCMDocumentUsages', [], `${filterTerm}$select=Usage,UsageDescription`).then(results => {
        return {
            name: 'Usage',
            values: Array.from(results, (/** @type {WCMDocumentUsage} */ r) => ({
                ReturnValue: r.Usage,
                DisplayValue: r.UsageDescription,
            })),
        };
    });
}
