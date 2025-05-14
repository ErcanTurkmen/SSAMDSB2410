import FilterLibrary from '../../Filter/FilterLibrary';
import FilterOnLoaded from '../../Filter/FilterOnLoaded';
/**
* This function sets datepicker values based on applied/persisted filters
* @param {IClientAPI} clientAPI
*/
export default function VoyagesSearchFilterOnLoaded(context) {
    FilterOnLoaded(context); //Run the default filter on loaded

    const filters = context.getPageProxy().getFilter().getFilters();
    if (!filters) {
        return;
    }
    const fcVoyage = context.getControls().find(c => c.getType() === 'Control.Type.FormCellContainer');
    const dateTimeFieldsCfg = {
        PlannedArrivalDate: {
            switchControlName: 'PADateSwitch',
            datePickerControlsNames: ['StartDateFilter', 'EndDateFilter'],
        },
    };
    FilterLibrary.SetValueInDatePickersFromQueryOptions(context, dateTimeFieldsCfg, filters, fcVoyage);
}
