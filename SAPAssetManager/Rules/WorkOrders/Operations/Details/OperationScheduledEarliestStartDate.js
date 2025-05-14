import GetDateValue from '../../../DateTime/GetDateValue';

export default function OperationScheduledEarliestStartDate(context) {
    return GetDateValue(context, 'SchedEarliestStartDate', 'SchedLatestEndTime');
}
