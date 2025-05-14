
export default function GetWorkCenterIdDescription(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'], [], '$expand=WorkCenters&$select=WorkCenters/WorkCenterDescr,WorkCenters/ExternalWorkCenterId').then(results => {
        const binding = results.getItem(0);
        return binding.WorkCenters ? `${binding.WorkCenters.ExternalWorkCenterId} - ${binding.WorkCenters.WorkCenterDescr}` : '-';
    });
}
