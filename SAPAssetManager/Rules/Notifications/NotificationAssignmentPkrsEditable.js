import assnType from '../Common/Library/AssignmentType';

export default function NotificationAssignmentPkrsEditable(control) {
    let controlName = control.getName();
    switch (controlName) {
        case 'MainWorkCenterListPicker':
            return isEditable('MainWorkCenter');
        case 'PlannerGroupListPicker':
            return isEditable('PlanningGroup');
        default:
            return true;
    }
}

function isEditable(controlName) {
    let controlDefs = assnType.getNotificationAssignmentDefaults();
    return controlDefs[controlName].enabled || true;
}
