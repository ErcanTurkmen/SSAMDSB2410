import FSMOverviewHelpers, { FSMSegementedLanguageKeys } from '../OverviewPage/Helpers/FSMOverviewHelpers';

/**
* Changing ActualDate state variable when calendar section changes on new FSM overview
* @param {IClientAPI} context
*/
export default function CalendarDateChanged(context) {
    let sectionedTable = context.getPageProxy().getControls()[0];
    let dateControlSection = sectionedTable.getSection('CalendarSection');
    if (dateControlSection) {
        let date = context.getSelectedDate();
        if (date) {
            const newDate = new Date(new Date(date).setHours(0,0,0,0));
            // as far as we have single day picker - putting one date both into upper and lower bounds
            // in that case everything would be filtered as we enter only one date
            const bounds = {
                lowerBound: newDate,
                upperBound: newDate, 
            };
            // updating custom saved state to store custom date value
            FSMOverviewHelpers.setFSMSegmentedSavedValue(context, FSMSegementedLanguageKeys.customShow);
            FSMOverviewHelpers.setFSMSegmentedSavedCustomDate(context, newDate);
            return FSMOverviewHelpers.updateDateRangeVariable(context, bounds, FSMSegementedLanguageKeys.customShow).finally(() => {
                const segmentedSection = sectionedTable.getSection('PeriodFilterSection');
                if (segmentedSection) {
                    // resetting segmented value on date selection to provide ability reselect Custom again
                    segmentedSection.getControl('PeriodFilterSectionSegmented').setValue('');
                }
            });
        }
    }
}
