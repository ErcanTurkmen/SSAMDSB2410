import libCommon from '../../Common/Library/CommonLibrary';

export default function WorkOrderPlannerGroup(context) {
    let assignmentType = libCommon.getWorkOrderAssignmentType(context);
    if (assignmentType === '5' && libCommon.getDefaultUserParam('USER_PARAM.IHG')) {
        return libCommon.getDefaultUserParam('USER_PARAM.IHG');
    } else {
        return '';
    }
}
