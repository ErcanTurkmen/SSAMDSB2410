import { GetDateIntervalFilterValueDateAndTime } from '../../Common/GetDateIntervalFilterValue';

export default function WorkApprovalsListViewFilterResults(context) {
    /** @type {IControlContainerProxy} */
    const fcContainer = context.getControls().find(c => c.getType() === 'Control.Type.FormCellContainer');
    let filterResults = ['SortFilter']
        .map(controlName => fcContainer.getControl(controlName).getValue())  // FormCell.Filter
        .concat(['HeaderStatusFilter', 'FunctionalLocationFilter', 'EquipmentFilter']
            .map(controlName => fcContainer.getControl(controlName).getFilterValue()));  // FormCell.ListPicker

    //get values from DatePickers
    return filterResults.concat([
        ['ValidFrom', 'ValidFrmTime', ...['ValidFromFilterVisibleSwitch', 'ValidFromDatePickerStart', 'ValidFromDatePickerEnd'].map(n => fcContainer.getControl(n))],
        ['ValidTo', 'ValidToTime', ...['ValidToFilterVisibleSwitch', 'ValidToDatePickerStart', 'ValidToDatePickerEnd'].map(n => fcContainer.getControl(n))]]
        .map(([dateFilterPropName, timeFilterPropName, visibilitySwitch, startControl, endControl]) =>
            GetDateIntervalFilterValueDateAndTime(context, dateFilterPropName, timeFilterPropName, visibilitySwitch, startControl, endControl)))
        .filter(x => x !== undefined);
}
