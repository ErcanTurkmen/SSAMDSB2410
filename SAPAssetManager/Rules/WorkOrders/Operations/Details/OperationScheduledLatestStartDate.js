import GetDateValue from '../../../DateTime/GetDateValue';

export default function OperationScheduledLatestStartDate(context) {
    return GetDateValue(context, 'SchedLatestStartDate', 'SchedEarliestStartTime');
}
