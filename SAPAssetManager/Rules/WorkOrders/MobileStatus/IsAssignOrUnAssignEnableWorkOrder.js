import ValidationLibrary from '../../Common/Library/ValidationLibrary';
import isSupervisorSectionVisibleForWO from '../../Supervisor/SupervisorRole/IsSupervisorSectionVisibleForWO';
/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function IsAssignOrUnAssignEnableWorkOrder(context) {
    return isSupervisorSectionVisibleForWO(context).then(function(visible) {
        if (!visible) {
            return false;
        }
        return context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'] + '/WOPartners', [], "$filter=PartnerFunction eq 'VW'")
            .then(partners => ValidationLibrary.evalIsEmpty(partners) || (!ValidationLibrary.evalIsEmpty(partners) && partners.length === 1 && Object.prototype.hasOwnProperty.call(partners.getItem(0), '@sap.isLocal')));
    });
}
