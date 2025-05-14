import filterOnLoaded from '../../../Filter/FilterOnLoaded';
import { SetValueInDatePickersFromQueryOptions } from '../../Common/GetDateIntervalFilterValue';

export default function WorkApprovalsFilterOnLoaded(context) {

    filterOnLoaded(context);

    const filters = context.getPageProxy().getFilter().getFilters();
    if (!filters) {
        return;
    }

    const dateTimeFieldsCfg = {
        ValidFrom: {
            switchControlName: 'ValidFromFilterVisibleSwitch',
            datePickerControlsNames: ['ValidFromDatePickerStart', 'ValidFromDatePickerEnd'],
        },
        ValidTo: {
            switchControlName: 'ValidToFilterVisibleSwitch',
            datePickerControlsNames: ['ValidToDatePickerStart', 'ValidToDatePickerEnd'],
        },
    };

    SetValueInDatePickersFromQueryOptions(context, dateTimeFieldsCfg, filters);
}
