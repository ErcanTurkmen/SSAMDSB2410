import filterOnLoaded from '../../Filter/FilterOnLoaded';
import { SetValueInDatePickersFromQueryOptions } from '../Common/GetDateIntervalFilterValue';
import AssignedToLibrary from '../Common/AssignedToLibrary';

export default function SafetyCertificatesFilterOnLoaded(context) {

    filterOnLoaded(context); //Run the default filter on loaded

    const filters = context.getPageProxy().getFilter().getFilters();
    if (!filters) {
        return;
    }

    const dateTimeFieldsCfg = {
        ValidFromDate: {
            switchControlName: 'ValidFromFilterVisibleSwitch',
            datePickerControlsNames: ['ValidFromDatePickerStart', 'ValidFromDatePickerEnd'],
        },
        ValidToDate: {
            switchControlName: 'ValidToFilterVisibleSwitch',
            datePickerControlsNames: ['ValidToDatePickerStart', 'ValidToDatePickerEnd'],
        },
    };

    SetValueInDatePickersFromQueryOptions(context, dateTimeFieldsCfg, filters);

    const partnersNav = context.getPageProxy().binding.PartnersNavPropName;
    AssignedToLibrary.CollectAssignedToSelectedItemsFromFilterCriteria(context, filters, partnersNav);
}
