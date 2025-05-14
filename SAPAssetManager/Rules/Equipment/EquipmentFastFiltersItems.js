import { PlanningPlantFastFilterSorter } from '../FastFilters/PlanningPlantFastFilterSorter';
import { getWorkCenterFastFilterItem } from '../FastFilters/WorkCenterFastFilter';
import { WorkcenterFastFilterSorter } from '../FastFilters/WorkcenterFastFilterSorter';
import { ModifiedFastFilterItem } from '../FastFilters/ModifiedFastFilterItem';

export default async function EquipmentFastFiltersItems(context) {
    return [
        PlanningPlantFastFilterSorter(),
        WorkcenterFastFilterSorter(),
        await getWorkCenterFastFilterItem(context, 'MaintWorkCenter'),
        ModifiedFastFilterItem('sap.hasPendingChanges() or EquipDocuments/any(d: sap.hasPendingChanges())'),
    ].filter(i => !!i);
}
