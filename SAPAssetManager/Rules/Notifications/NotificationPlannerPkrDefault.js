import assnType from '../Common/Library/AssignmentType';
import libVal from '../Common/Library/ValidationLibrary';

export default function NotificationPlannerPkrDefault(context) {
    let binding = context.binding;
    let planningGroup;
    if (!libVal.evalIsEmpty(binding.PlanningGroup)) {
        planningGroup = binding.PlanningGroup;
    }
    if (libVal.evalIsEmpty(planningGroup)) {
        const controlDefs = assnType.getNotificationAssignmentDefaults();
        planningGroup = controlDefs.PlanningGroup.default;
    }

    return planningGroup;
}
