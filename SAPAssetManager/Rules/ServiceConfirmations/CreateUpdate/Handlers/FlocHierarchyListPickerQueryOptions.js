import AssignmentType from '../../../Common/Library/AssignmentType';

export default function FlocHierarchyListPickerQueryOptions() {
    let planningPlant =  AssignmentType.getWorkOrderFieldDefault('WorkOrderHeader', 'PlanningPlant');
    let queryOptions = '$orderby=FuncLocId';

    if (planningPlant) {
        queryOptions += `&$filter=(PlanningPlant eq '' or PlanningPlant eq '${planningPlant}')`;
    }

    return queryOptions;
}
