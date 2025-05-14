import TimeSheetsData from './TimeSheetsData';
import { TimeSheetDetailsLibrary as libTSDetails } from './TimeSheetLibrary';
import ConvertDoubleToHourString from '../Confirmations/ConvertDoubleToHourString';
import { getAdditionalUserFilterValue, getTimeLabel, getPersonelNumForFilter } from '../OverviewPage/TimeCaptureSection/AnotherTechnicianFormatFunctions';

export default function TimeSheetsYesterdaysHours(context, format = true) {
    const convertedZeroHours = ConvertDoubleToHourString(0.0);
    let date = new Date();
    date.setDate(date.getDate() - 1);
    return TimeSheetsData(context, date).then((results) => {
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
