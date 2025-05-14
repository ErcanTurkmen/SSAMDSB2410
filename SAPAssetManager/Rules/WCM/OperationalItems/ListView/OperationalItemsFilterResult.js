import libVal from '../../../Common/Library/ValidationLibrary';
import AssignedToLibrary from '../../Common/AssignedToLibrary';

export default function OperationalItemsFilterResult(context) {
    const fcContainer = context.getControls().find(c => c.getType() === 'Control.Type.FormCellContainer');
    let filterResult = ['SortFilter', 'PriorityFilter', 'OperationalGroupFilter', 'TagFormatFilter']
        .map(controlName => fcContainer.getControl(controlName).getValue())
        .concat(['StatusFilter'].map(controlName => fcContainer.getControl(controlName).getFilterValue()));

    const techObjectControl = fcContainer.getControl('TechnicalObjectFilter');
    const techObjectValue = techObjectControl.getValue();

    filterResult = AssignedToLibrary.AddFilterCriteriaFromAssignedToFilters(context, fcContainer, filterResult);

    if (!libVal.evalIsEmpty(techObjectValue)) {
        const valueMap = new Map(techObjectValue.map(({ ReturnValue, DisplayValue }) => [ReturnValue, DisplayValue.Title]));
        filterResult.push(context.createFilterCriteria(context.filterTypeEnum.Filter, techObjectControl.getFilterProperty(), undefined, [...valueMap.keys()], false, undefined, [...valueMap.values()]));
    }

    return filterResult;
}
