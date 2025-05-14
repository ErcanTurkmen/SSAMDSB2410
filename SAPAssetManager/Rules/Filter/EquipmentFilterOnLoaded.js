import { setWorkCenterFilterValues } from '../FastFilters/WorkCenterFastFilter';
import filterOnLoaded from './FilterOnLoaded';

export default function EquipmentFilterOnLoaded(context) {
    filterOnLoaded(context); //Run the default filter on loaded
    setWorkCenterFilterValues(context, context.getPageProxy().getControl('FormCellContainer').getControl('WorkCenterFilter'), 'MaintWorkCenter');
}

