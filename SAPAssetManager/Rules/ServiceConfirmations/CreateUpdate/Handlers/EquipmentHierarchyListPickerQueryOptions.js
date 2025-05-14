import AssignmentType from '../../../Common/Library/AssignmentType';

export default function EquipmentHierarchyListPickerQueryOptions() {
    let planningPlant =  AssignmentType.getWorkOrderFieldDefault('WorkOrderHeader', 'PlanningPlant');
    let queryOptions = '$orderby=EquipId';

    if (planningPlant) {
        queryOptions += `&$filter=(PlanningPlant eq '' or PlanningPlant eq '${planningPlant}')`;
    }

    return queryOptions;
}
