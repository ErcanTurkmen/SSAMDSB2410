export default function WorkOrderDetailsMainWorkCenter(context) {
    let binding = context.binding;
    const id = binding.MainWorkCenter||binding.WorkCenterID;
    let filterQuery = `$filter=${context.binding['@odata.type']==='#sap_mobile.WCMDocumentHeader'?'WorkCenterId':'ExternalWorkCenterId'} eq '${id}'`;

    return context.read('/SAPAssetManager/Services/AssetManager.service', 'WorkCenters', [], filterQuery).then(function(result) {
        if (result && result.length > 0) {
            return `${context.binding['@odata.type']==='#sap_mobile.WCMDocumentHeader'?result.getItem(0).ExternalWorkCenterId:id} - ${result.getItem(0).WorkCenterDescr}`; 
        }
        return '-';
    });
}
