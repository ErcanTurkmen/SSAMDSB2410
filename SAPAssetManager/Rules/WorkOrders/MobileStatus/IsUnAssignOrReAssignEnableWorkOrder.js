import isSupervisorSectionVisibleForWO from '../../Supervisor/SupervisorRole/IsSupervisorSectionVisibleForWO';
/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function IsUnAssignOrReAssignEnableWorkOrder(context, actionBinding) {
    const binding = actionBinding || context.binding;

    return isSupervisorSectionVisibleForWO(context).then(function(visible) {
        if (visible) {
            let partnerFunction = 'VW';
            return context.read('/SAPAssetManager/Services/AssetManager.service', binding['@odata.readLink'] + '/WOPartners', [], `$filter=PartnerFunction eq '${partnerFunction}' and sap.islocal()`).then(function(results) {
                return results && results.length > 0;
            });
        }
        return false;
    });
}
