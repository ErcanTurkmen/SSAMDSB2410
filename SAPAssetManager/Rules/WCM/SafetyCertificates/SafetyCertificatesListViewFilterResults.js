import { GetDateIntervalFilterValueDateAndTime } from '../Common/GetDateIntervalFilterValue';
import libAssignedTo from '../Common/AssignedToLibrary';


export default function SafetyCertificatesListViewFilterResults(context) {
    /** @type {IControlContainerProxy} */
    const fcContainer = context.getControls().find(c => c.getType() === 'Control.Type.FormCellContainer');
    let filterResults = ['SortFilter', 'ApprovalStatusFilter', 'PriorityFilter', 'UsageFilter']
        .map(controlName => fcContainer.getControl(controlName).getValue())  // FormCell.Filter
        .concat(['FunctionalLocationFilter', 'EquipmentFilter', 'MobileStatusFilter']
            .map(controlName => fcContainer.getControl(controlName).getFilterValue()));  // FormCell.ListPicker

    filterResults = libAssignedTo.AddFilterCriteriaFromAssignedToFilters(context, fcContainer, filterResults);

    return filterResults.concat([
        ['ValidFromDate', 'ValidFromTime', ...['ValidFromFilterVisibleSwitch', 'ValidFromDatePickerStart', 'ValidFromDatePickerEnd'].map(n => fcContainer.getControl(n))],
        ['ValidToDate', 'ValidToTime', ...['ValidToFilterVisibleSwitch', 'ValidToDatePickerStart', 'ValidToDatePickerEnd'].map(n => fcContainer.getControl(n))]]
        .map(([dateFilterPropName, timeFilterPropName, visibilitySwitch, startControl, endControl]) =>
            GetDateIntervalFilterValueDateAndTime(context, dateFilterPropName, timeFilterPropName, visibilitySwitch, startControl, endControl)))
        .filter(x => x !== undefined);
}
