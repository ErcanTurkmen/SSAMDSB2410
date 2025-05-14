import FSMMapQueryOptions from './FSMMapQueryOptions';
import { WorkOrderLibrary as libWO } from '../WorkOrders/WorkOrderLibrary';

export default function FSMOverviewMapQueryOptions(context) {  
    const defaultDates = libWO.getActualDates(context);
    return libWO.dateOrdersFilter(context, defaultDates, 'ScheduledStartDate').then(dateFilter => {
        return FSMMapQueryOptions(context, dateFilter);
    });   
}
