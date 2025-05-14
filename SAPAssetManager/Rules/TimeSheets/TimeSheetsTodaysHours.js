import TimeSheetData from './TimeSheetsData';
import { TimeSheetDetailsLibrary as libTSDetails } from './TimeSheetLibrary';
import ConvertDoubleToHourString from '../Confirmations/ConvertDoubleToHourString';
import { getAdditionalUserFilterValue, getTimeLabel, getPersonelNumForFilter } from '../OverviewPage/TimeCaptureSection/AnotherTechnicianFormatFunctions';

export default function TimeSheetsTodaysHours(context, format = true) {
    const convertedZeroHours = ConvertDoubleToHourString(0.0);
    return TimeSheetData(context, new Date()).then((results) => {
        // if format is false (called from different place) - calling rule which doesn't trigger context.getProperty()
        const persNum = format ? getAdditionalUserFilterValue(context) : getPersonelNumForFilter(context);
        return libTSDetails.TimeSheetTotalHoursWithDate(context, results.Date, persNum).then((hours) => {
            if (format) {
                const convertedHours = ConvertDoubleToHourString(hours);
                return getTimeLabel(context, convertedHours);
            } else {
                return hours;
            }
        }).catch(() => {
            return getTimeLabel(context, convertedZeroHours);
        });
    }).catch(() => {
        return getTimeLabel(context, convertedZeroHours);
    });
}
