import TimeCaptureTypeHelper from './TimeCaptureTypeHelper';
import TimeSheetTodayHoursForCrew from '../../Crew/TimeSheets/CrewTimeSheetsTodaysHours';
import TimeSheetTodayHours from '../../TimeSheets/TimeSheetsTodaysHours';
import ODataDate from '../../Common/Date/ODataDate';
import ConfirmationTotalDuration from '../../Confirmations/ConfirmationTotalDuration';
import { checkEmptyStatusTextOnDisabledFeature, getAdditionalUserFilterValue, getTimeLabel } from './AnotherTechnicianFormatFunctions';
import libCrew from '../../Crew/CrewLibrary';

export default function TimeCaptureSectionTodayHours(context) {
    if (checkEmptyStatusTextOnDisabledFeature(context)) {
        return ' ';
    }
    return TimeCaptureTypeHelper(context, ConfirmationTodayHours, TimeSheetsTodayHours);
}

export function ConfirmationTodayHours(context) {

    let odataDate = new ODataDate();
    let date = new Date(odataDate.toDBDateString());
    const persNum = getAdditionalUserFilterValue(context);

    return ConfirmationTotalDuration(context, date, undefined, persNum).then(hours => {
        return getTimeLabel(context, hours);
    });
}
export function TimeSheetsTodayHours(context) {
    if (libCrew.isCrewFeatureEnabled(context)) {
        return TimeSheetTodayHoursForCrew(context).then(hours => {
            return context.localizeText('x_hours', [hours]);
        });
    } else {
        return TimeSheetTodayHours(context);
    }
}

