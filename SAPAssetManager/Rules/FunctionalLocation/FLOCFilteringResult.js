import { createNewWorkCenterFilterCriteria } from '../FastFilters/WorkCenterFastFilter';

export default async function FLOCFilteringResult(context) {
    const fcContainer = context.getControls().find(c => c.getType() === 'Control.Type.FormCellContainer');
    const [sortFilter, localFilter] = ['SortFilter', 'LocalFilter'].map(n => fcContainer.getControl(n).getValue());
    let newLocalFilter;
    if (localFilter && localFilter.filterItems.length && localFilter.filterItems[0]) {
        newLocalFilter = context.createFilterCriteria(context.filterTypeEnum.Filter, undefined, undefined, ['sap.islocal()'], true, undefined, [context.localizeText('is_local')]);
    }
    const newWcFilter = await createNewWorkCenterFilterCriteria(context, fcContainer.getControl('WorkCenterFilter').getFilterValue(), 'WorkCenter');

    return [sortFilter, newLocalFilter, newWcFilter].filter(i=> !!i);
}
