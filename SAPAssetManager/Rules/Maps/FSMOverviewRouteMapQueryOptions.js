import { WorkOrderLibrary as libWO } from '../WorkOrders/WorkOrderLibrary';

export default function FSMOverviewRouteMapQueryOptions(context) {
    const defaultDates = libWO.getActualDates(context);
    return libWO.dateOrdersFilter(context, defaultDates, 'ScheduledStartDate')
        .then(dateFilter => {
            const queryOptions = `$top=1${dateFilter ? '&$filter=' + dateFilter : ''}`;
            return libWO.attachWorkOrdersFilterByAssgnTypeOrWCM(context, queryOptions);
        }).catch(()=>{
            return libWO.attachWorkOrdersFilterByAssgnTypeOrWCM(context, '$top=1');
        });
}
