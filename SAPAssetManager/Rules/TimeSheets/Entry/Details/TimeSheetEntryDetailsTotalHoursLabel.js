import {TimeSheetDetailsLibrary as libTSDetails} from '../../TimeSheetLibrary';
import ConvertDoubleToHourString from '../../../Confirmations/ConvertDoubleToHourString';
import libCrew from '../../../Crew/CrewLibrary';
import { checkEmptyStatusTextOnDisabledFeature, getAdditionalUserFilterValue, getTimeLabel } from '../../../OverviewPage/TimeCaptureSection/AnotherTechnicianFormatFunctions';

export default function TimeSheetEntryDetailsTotalHoursLabel(pageClientAPI) {
    let timePromise;
    const crewEnabled = libCrew.isCrewFeatureEnabled(pageClientAPI);

    if (crewEnabled) {
        timePromise = libCrew.getTotalHoursWithDateForCurrentCrew(pageClientAPI, pageClientAPI.binding.Date);
    } else {
        if (checkEmptyStatusTextOnDisabledFeature(pageClientAPI)) {
            return ' ';
        }
        const persNum = getAdditionalUserFilterValue(pageClientAPI);
        timePromise = libTSDetails.TimeSheetEntryDetailsTotalHours(pageClientAPI, persNum);
    }

    return timePromise.then(function(hours) {
        if (crewEnabled) {
            return pageClientAPI.localizeText('x_hours', [ConvertDoubleToHourString(hours)]);
        } else {
            return getTimeLabel(pageClientAPI, ConvertDoubleToHourString(hours));
        }
    }); 
}
