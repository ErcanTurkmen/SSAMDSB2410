import { ModifiedFastFilterItem } from '../FastFilters/ModifiedFastFilterItem';
import { PlanningPlantFastFilterSorter } from '../FastFilters/PlanningPlantFastFilterSorter';
import { getWorkCenterFastFilterItem } from '../FastFilters/WorkCenterFastFilter';
import { WorkcenterFastFilterSorter } from '../FastFilters/WorkcenterFastFilterSorter';

export default async function FunctionalLocationFastFiltersItems(context) {
    return [
        PlanningPlantFastFilterSorter(),
        WorkcenterFastFilterSorter(),
        await getWorkCenterFastFilterItem(context, 'WorkCenter'),
        ModifiedFastFilterItem('sap.hasPendingChanges() or FuncLocDocuments/any(d: sap.hasPendingChanges())'),
    ].filter(i => !!i);
}
