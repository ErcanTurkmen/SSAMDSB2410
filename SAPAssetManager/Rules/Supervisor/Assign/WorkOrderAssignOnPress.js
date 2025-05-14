import libCom from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';

export default function WorkOrderAssignOnPress(context) {
    try {
        const IsUnAssign = libCom.getStateVariable(context, 'IsUnAssign');
        const IsAssign = libCom.getStateVariable(context, 'IsAssign');
        const IsReAssign = libCom.getStateVariable(context, 'IsReAssign');

        if (!libVal.evalIsEmpty(IsUnAssign) && IsUnAssign) {
            return context.executeAction('/SAPAssetManager/Rules/Supervisor/UnAssign/WorkOrderUnAssignChangeSet.js');
        } else if (!libVal.evalIsEmpty(IsAssign) && IsAssign) {
            return context.executeAction('/SAPAssetManager/Actions/Supervisor/Assign/WorkOrderAssignPageRequiredFields.action');
        } else if (!libVal.evalIsEmpty(IsReAssign) && IsReAssign) {
            return context.executeAction('/SAPAssetManager/Actions/Supervisor/ReAssign/WorkOrderReAssignPageRequiredFields.action');
        }
    } catch (error) {
        return context.executeAction('/SAPAssetManager/Actions/Supervisor/Assign/WorkOrderAssignPageRequiredFields.action');
    }
}
