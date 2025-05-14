import FilterOnLoaded from '../../../Filter/FilterOnLoaded';
import FilterLibrary from '../../../Filter/FilterLibrary';

export default function ServiceQuotationsFilterOnLoaded(context) {
    FilterOnLoaded(context); //Run the default filter on loaded

    const filters = context.getPageProxy().getFilter().getFilters();
    if (!filters) {
        return;
    }

    const dateTimeFieldsCfg = {
        QuotationStartDateTime: {
            switchControlName: 'ValidFromFilterVisibleSwitch',
            datePickerControlsNames: ['QuotationStartDateTimeStart', 'QuotationStartDateTimeEnd'],
        },
        QuotationEndDateTime: {
            switchControlName: 'ValidToFilterVisibleSwitch',
            datePickerControlsNames: ['QuotationEndDateTimeStart', 'QuotationEndDateTimeEnd'],
        },
    };

    FilterLibrary.SetValueInDatePickersFromQueryOptions(context, dateTimeFieldsCfg, filters, context.getPageProxy().getControls().find(c => c.getType() === 'Control.Type.FormCellContainer'));
}
