import TimeCaptureTypeHelper from './TimeCaptureTypeHelper';
import TimeSheetYesterdayHoursForCrew from '../../Crew/TimeSheets/CrewTimeSheetsPreviousDayHours';
import TimeSheetYesterdayHours from '../../TimeSheets/TimeSheetsYesterdaysHours';
import ConfirmationTotalDuration from '../../Confirmations/ConfirmationTotalDuration';
import ODataDate from '../../Common/Date/ODataDate';
import { checkEmptyStatusTextOnDisabledFeature, getAdditionalUserFilterValue, getTimeLabel } from './AnotherTechnicianFormatFunctions';
import libCrew from '../../Crew/CrewLibrary';

export default function TimeCaptureSectionYesterdayHours(context) {
    if (checkEmptyStatusTextOnDisabledFeature(context)) {
        return ' ';
    }
    return TimeCaptureTypeHelper(context, ConfirmationYesterdayHours, TimeSheetsYesterdayHours);
}

function ConfirmationYesterdayHours(context) {

    let odataDate = new ODataDate();
    let date = new Date(odataDate.toDBDateString());
    date.setDate(date.getDate() - 1);
    const persNum = getAdditionalUserFilterValue(context);

    return ConfirmationTotalDuration(context, date, undefined, persNum).then(hours => {
        return getTimeLabel(context, hours);
    });
}
export function TimeSheetsYesterdayHours(context) {
    if (libCrew.isCrewFeatureEnabled(context)) {
        return TimeSheetYesterdayHoursForCrew(context).then(hours => {
            return context.localizeText('x_hours', [hours]);
        });
    } else {
        return TimeSheetYesterdayHours(context);
    }
}
