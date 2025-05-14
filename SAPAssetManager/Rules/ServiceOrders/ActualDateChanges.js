import FSMOverviewHelpers from '../OverviewPage/Helpers/FSMOverviewHelpers';

/**
* Changing ActualDate state variable when function is afected from datepicker
* @param {IClientAPI} context
*/
export default function ActualDateChanges(context) {
    let sectionedTable = context.getPageProxy().getControls()[0];
    let dateControlSection = sectionedTable.getSection('DatePickerSection');
    if (dateControlSection) {
        let dateControl = dateControlSection.getControl('ActualDate');
        if (dateControl) {
            let date = dateControl._clientAPIProps().newControlValue;
            if (date) {
                const newDate = new Date(new Date(date).setHours(0,0,0,0));
                // as far as we have single day picker - putting one date both into upper and lower bounds
                // in that case everything would be filtered as we enter only one date
                const bounds = {
                    lowerBound: newDate,
                    upperBound: newDate, 
                };
                return FSMOverviewHelpers.updateDateRangeVariable(context, bounds);
            }
        }
    }
}
