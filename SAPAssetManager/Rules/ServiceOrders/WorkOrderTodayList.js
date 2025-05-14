import { WorkOrderLibrary as libWO } from '../WorkOrders/WorkOrderLibrary';
import IsS4ServiceIntegrationEnabled from './IsS4ServiceIntegrationEnabled';
import WorkOrdersFSMQueryOption from '../WorkOrders/ListView/WorkOrdersFSMQueryOption';

/**
* Returning actual query options depending on current date
* @param {IClientAPI} context
*/
export default function WorkOrderTodayList(context) {
    const defaultDates = libWO.getActualDates(context);

    if (IsS4ServiceIntegrationEnabled(context)) {
        return Promise.resolve('$top=2');
    } else {
        return libWO.dateOrdersFilter(context, defaultDates, 'ScheduledStartDate').then(dateFilter => {
            return WorkOrdersFSMQueryOption(context).then(types => {
                const queryOptions = `$expand=OrderMobileStatus_Nav,WOPriority&$filter=${dateFilter} and ${types}&$top=2`;
                return libWO.attachWorkOrdersFilterByAssgnTypeOrWCM(context, queryOptions);
            });
        });
    }
}
