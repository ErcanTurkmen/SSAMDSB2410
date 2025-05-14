import libVal from '../../Common/Library/ValidationLibrary';
import libSearch from '../OnlineSearchLibrary';
import GetPropertyNameForEntity from './GetPropertyNameForEntity';

export default function EquipFuncLocListFilterResults(context) {
    const fcContainer = context.getControls().find(c => c.getType() === 'Control.Type.FormCellContainer');
    const [sortFilter, statusFilter] = ['SortFilter', 'StatusFilter'].map(n => fcContainer.getControl(n).getValue());
    const listPickerFilters = [
        'MaintenacePlantLstPkr',
        'CategoryLstPkr',
        'LocationLstPkr',
        'PlannerGroupLstPkr',
        'PlanningPlantLstPkr',
        'WorkCenterFilter',
    ].map(n => fcContainer.getControl(n).getFilterValue());
    const simplePropertyFilters = libSearch.getSimplePropertyControls(context).map(control => {
        const value = control.getValue();
        const name = control.getName();
        const filterProperty = GetPropertyNameForEntity(context, 'FilterProperty', name) || name;
        if (!libVal.evalIsEmpty(value)) {
            if (['FuncLocDesc', 'EquipDesc', 'Manufacturer'].includes(filterProperty)) {
                return context.createFilterCriteria(context.filterTypeEnum.Filter, undefined, undefined, [`substringof('${value}', ${filterProperty})`], true);
            }
            return context.createFilterCriteria(context.filterTypeEnum.Filter, filterProperty, control.getCaption(), [value], false);
        }
        return null;
    });

    return [sortFilter, statusFilter, ...listPickerFilters, ...simplePropertyFilters].filter(c => !!c);
}
