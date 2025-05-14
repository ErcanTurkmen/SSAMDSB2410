import FilterLibrary from '../../../Filter/FilterLibrary';
import FilterOnLoaded from '../../../Filter/FilterOnLoaded';
/**
* This function sets datepicker values based on applied/persisted filters
* @param {IClientAPI} clientAPI
*/
export default function ContainersSearchFilterOnLoaded(context) {
    FilterOnLoaded(context); //Run the default filter on loaded

    const filters = context.getPageProxy().getFilter().getFilters();
    if (!filters) {
        return;
    }
    const fcContainer = context.getControls().find(c => c.getType() === 'Control.Type.FormCellContainer');
    const dateTimeFieldsCfg = {
        DispatchDate: {
            switchControlName: 'DispatchDateSwitch',
            datePickerControlsNames: ['StartDateFilter', 'EndDateFilter'],
        },
    };
    FilterLibrary.SetValueInDatePickersFromQueryOptions(context, dateTimeFieldsCfg, filters, fcContainer);
}
