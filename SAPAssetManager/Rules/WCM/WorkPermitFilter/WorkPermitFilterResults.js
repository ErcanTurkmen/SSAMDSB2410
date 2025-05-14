import { GetDateIntervalFilterValueDateAndTime } from '../Common/GetDateIntervalFilterValue';
import libAssignedTo from '../Common/AssignedToLibrary';


export default function WorkPermitFilterResults(context) {
    /** return an array of FilterCriterias
     * get the filterCriterias from the filter controls, create new ones for work type and work requirement and validfrom-validto filters
     * save the date filters' values to clientdata */
    /** @type {IControlContainerProxy} */
    const fcContainer = context.getControls().find(c => c.getType() === 'Control.Type.FormCellContainer');
    let filterResults = ['SortFilter', 'ApprovalStatusFilter', 'PriorityFilter', 'HeaderStatusFilter', 'UsageFilter']
        .map(controlName => fcContainer.getControl(controlName).getValue())  // FormCell.Filter
        .concat(['FunctionalLocationFilter', 'EquipmentFilter']
            .map(controlName => fcContainer.getControl(controlName).getFilterValue()))  // FormCell.ListPicker
        .concat(['WorkType1Filter', 'WorkType2Filter', 'Requirements1Filter', 'Requirements2Filter']
            .map(controlName => fcContainer.getControl(controlName).getValue())  // hack: create custom query instead of the FilterProperty-driven one from listpicker
            .map((selectedItems) => selectedItems && selectedItems.length > 0 ? context.createFilterCriteria(context.filterTypeEnum.Filter, undefined, undefined, CollectWorkReqFilters(selectedItems, 'ReturnValue'), true, undefined, CollectWorkReqFilters(selectedItems, 'DisplayValue')) : undefined));

    filterResults = libAssignedTo.AddFilterCriteriaFromAssignedToFilters(context, fcContainer, filterResults);         

    return filterResults.concat([
        ['ValidFrom', 'ValidFromTime', ...['ValidFromFilterVisibleSwitch', 'ValidFromDatePickerStart', 'ValidFromDatePickerEnd'].map(n => fcContainer.getControl(n))],
        ['ValidTo', 'ValidToTime', ...['ValidToFilterVisibleSwitch', 'ValidToDatePickerStart', 'ValidToDatePickerEnd'].map(n => fcContainer.getControl(n))]]
        .map(([dateFilterPropName, timeFilterPropName, visibilitySwitch, startControl, endControl]) =>
            GetDateIntervalFilterValueDateAndTime(context, dateFilterPropName, timeFilterPropName, visibilitySwitch, startControl, endControl)))
        .filter(x => x !== undefined);
}

function CollectWorkReqFilters(selectedItems, property) {
    /** create filterTerm from the selected worktypes or workrequirements */
    return selectedItems.map(i => property === 'ReturnValue' ? `WCMRequirements/${i[property]} ne ''` : i[property]);
}
