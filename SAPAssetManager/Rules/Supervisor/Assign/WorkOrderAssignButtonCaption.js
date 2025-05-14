import libCom from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';

export default function WorkOrderAssignButtonCaption(context) {
    try {
        const IsUnAssign = libCom.getStateVariable(context, 'IsUnAssign');
        const IsAssign = libCom.getStateVariable(context, 'IsAssign');
        const IsReAssign = libCom.getStateVariable(context, 'IsReAssign');

        if (!libVal.evalIsEmpty(IsUnAssign) && IsUnAssign) {
            return context.localizeText('unassign');
        } else if (!libVal.evalIsEmpty(IsAssign) && IsAssign) {
            return context.localizeText('assign');
        } else if (!libVal.evalIsEmpty(IsReAssign) && IsReAssign) {
            return context.localizeText('reassign');
        }
        return context.localizeText('assign');
    } catch (error) {
        return context.localizeText('assign');
    } 
}
