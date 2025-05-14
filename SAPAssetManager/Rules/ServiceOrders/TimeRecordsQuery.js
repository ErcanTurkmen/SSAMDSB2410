import ODataDate from '../Common/Date/ODataDate';
import FSMOverviewHelpers from '../OverviewPage/Helpers/FSMOverviewHelpers';
import { WorkOrderLibrary as libWO } from '../WorkOrders/WorkOrderLibrary';
/**
* Returning actual query options for time records depending on current date range
* @param {IClientAPI} context
*/
export default function TimeRecordsQuery(context) {
    const { lowerBound, upperBound } = libWO.getActualDates(context);
    const datesBetween = FSMOverviewHelpers.getDatesRangeArrayDayInterval(lowerBound, upperBound);
    const datesFilter = datesBetween.map((date) => {
        let oDataDate = new ODataDate(date);
        let dateQuery = oDataDate.queryString(context, 'date');
        return `PostingDate eq ${dateQuery}`;
    }).join(' or ');
    return `$filter=${datesFilter}&$orderby=PostingDate desc&$top=2`;
}
