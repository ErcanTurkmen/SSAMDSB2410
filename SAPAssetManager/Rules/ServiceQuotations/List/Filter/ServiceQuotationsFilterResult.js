import FilterLibrary from '../../../Filter/FilterLibrary';

export default function ServiceQuotationsFilterResult(context) {
    const formCellContainer = context.getControls().find(c => c.getType() === 'Control.Type.FormCellContainer');
    const filterResult = ['SortFilter', 'MobileStatusFilter', 'PriorityFilter'].map(n => formCellContainer.getControl(n)?.getValue());

    const [validFromDatePickerStart, validFromDatePickerEnd, validFromFilterVisibleSwitch] = ['QuotationStartDateTimeStart', 'QuotationStartDateTimeEnd', 'ValidFromFilterVisibleSwitch'].map(n => formCellContainer.getControl(n));
    filterResult.push(FilterLibrary.getDateIntervalFilterCriteria(context, validFromDatePickerStart, validFromDatePickerEnd, validFromFilterVisibleSwitch, 'QuotationStartDateTime'));

    const [validToDatePickerStart, validToDatePickerEnd, validToFilterVisibleSwitch] = ['QuotationEndDateTimeStart', 'QuotationEndDateTimeEnd', 'ValidToFilterVisibleSwitch'].map(n => formCellContainer.getControl(n));
    filterResult.push(FilterLibrary.getDateIntervalFilterCriteria(context, validToDatePickerStart, validToDatePickerEnd, validToFilterVisibleSwitch, 'QuotationEndDateTime'));

    return filterResult.filter(c => !!c);
}
