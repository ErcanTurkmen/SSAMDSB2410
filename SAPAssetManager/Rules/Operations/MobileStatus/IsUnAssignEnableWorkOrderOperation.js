import isSupervisorSectionVisibleForOperations from '../../Supervisor/SupervisorRole/IsSupervisorSectionVisibleForOperations';

/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function IsUnAssignEnableWorkOrderOperation(context, binding = context.binding) {
    return isSupervisorSectionVisibleForOperations(context).then(function(visible) {
        if (visible) {
            return context.read('/SAPAssetManager/Services/AssetManager.service', binding['@odata.readLink'], ['OperationNo', 'OrderId', 'PersonNum','Employee_Nav/FirstName'], '$expand=Employee_Nav').then(function(results) {
                if (results && results.length > 0) {
                    let row = results.getItem(0);
                    if (row.Employee_Nav && row.PersonNum && row.PersonNum !== '00000000') {
                        let query = `$orderby=EffectiveTimestamp desc&$filter=EmployeeTo eq '${row.PersonNum}' and OperationNo eq '${row.OperationNo}' and OrderId eq '${row.OrderId}' and sap.islocal()`;
                        return context.read('/SAPAssetManager/Services/AssetManager.service', 'WorkOrderTransfers', [], query).then(function(transfers) {
                            return !!(transfers && transfers.length);
                        });
                    }
                }
                return false;
            });
        }
        return false;
    });
}
