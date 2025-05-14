import { setWorkCenterFilterValues } from '../FastFilters/WorkCenterFastFilter';
import filterOnLoaded from './FilterOnLoaded';

export default function FLOCFilterOnLoaded(context) {
    filterOnLoaded(context); //Run the default filter on loaded
    const fcContainer = context.getPageProxy().getControl('FormCellContainer');
    setWorkCenterFilterValues(context, fcContainer.getControl('WorkCenterFilter'), 'WorkCenter');
    if (hasIsLocalFilterCriteria(context)) {
        fcContainer.getControl('LocalFilter').setValue('true');
    }
}

function hasIsLocalFilterCriteria(context) {
    const criteria = context.getPageProxy().getFilter().getFilters();
    return criteria.some(({ type, filterItems }) => type === context.filterTypeEnum.Filter && !!filterItems.length && filterItems.some(i=> i.includes('sap.islocal()')));
}
