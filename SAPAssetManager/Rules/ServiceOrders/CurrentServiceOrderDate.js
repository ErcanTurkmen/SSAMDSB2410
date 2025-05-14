import { WorkOrderLibrary as libWO } from '../WorkOrders/WorkOrderLibrary';

export default function CurrentServiceOrderDate(context) {
    const { lowerBound, upperBound } = libWO.getActualDates(context);
    // if dates are equal
    if (upperBound.getTime() - lowerBound.getTime() === 0) {
        return lowerBound;
    }
    // returning current date if see date range
    // in this case section should be hidded, so we don't really have a need to return anything specific
    const nowDate = libWO.getBoundsFromDate(new Date());
    return nowDate.lowerBound;
}
