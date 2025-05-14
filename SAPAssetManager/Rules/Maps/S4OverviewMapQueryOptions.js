import { WorkOrderLibrary as libWO } from '../WorkOrders/WorkOrderLibrary';
import S4ServiceLibrary from '../ServiceOrders/S4ServiceLibrary';
import S4MapQueryOptions from './S4MapQueryOptions';

export default function S4OverviewMapQueryOptions(context) {
    const defaultDates = libWO.getActualDates(context);

    return S4ServiceLibrary.ordersDateFilter(context, defaultDates)
        .then(dateFilter => {
            return S4MapQueryOptions(context, dateFilter);
        }).catch(()=>{
            return '$top=1';
        });
}
