import ValidationLibrary from '../../Common/Library/ValidationLibrary';
import isSupervisorSectionVisibleForWO from '../../Supervisor/SupervisorRole/IsSupervisorSectionVisibleForWO';
/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function IsAssignEnableWorkOrder(context, actionBinding) {
    const binding = actionBinding || context.binding;

    return isSupervisorSectionVisibleForWO(context).then(function(visible) {
        if (!visible) {
            return false;
        }
        return context.read('/SAPAssetManager/Services/AssetManager.service', binding['@odata.readLink'] + '/WOPartners', [], "$filter=PartnerFunction eq 'VW'")
            .then(partners => !ValidationLibrary.evalIsEmpty(partners));
    });
}
