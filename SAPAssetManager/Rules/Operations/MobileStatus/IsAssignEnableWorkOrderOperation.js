import isSupervisorSectionVisibleForOperations from '../../Supervisor/SupervisorRole/IsSupervisorSectionVisibleForOperations';
import CommonLibrary from '../../Common/Library/CommonLibrary';

/**
* Checks if assigning is enabled for an operation
* @param {IClientAPI} context
*/
export default function IsAssignEnableWorkOrderOperation(context, binding = context.binding) {
    return isSupervisorSectionVisibleForOperations(context).then(function(visible) {
        if (visible) {
            return context.read('/SAPAssetManager/Services/AssetManager.service', binding['@odata.readLink'] + '/Employee_Nav', ['FirstName'], '').then(function(results) {
                if (results && results.length > 0) {
                    return false;
                }

                //Disables assigning via supervisor on assignment level A and 4
                const assignmentType = CommonLibrary.getWorkOrderAssignmentType(context);
                return assignmentType === 'A' || assignmentType === '4' ? false : true;
            });
        }
        return false;
    });
}
