import { WorkOrderLibrary as libWO } from '../WorkOrders/WorkOrderLibrary';
import WorkOrderOperationsFSMQueryOption from '../WorkOrders/Operations/WorkOrderOperationsFSMQueryOption';
import libVal from '../Common/Library/ValidationLibrary';
import { OperationLibrary as libOperations } from '../WorkOrders/Operations/WorkOrderOperationLibrary';

/**
* Returning actual query options depending on current date
* @param {IClientAPI} context
*/
export default function ServiceOperationsTodayList(context) {
    const defaultDates = libWO.getActualDates(context);

    return libWO.dateOperationsFilter(context, defaultDates, 'SchedEarliestStartDate').then(dateFilter => {
        return WorkOrderOperationsFSMQueryOption(context).then(fsmQueryOptions => {
            let queryOption = `$expand=OperationMobileStatus_Nav,WOHeader&$filter=${dateFilter}`;
            if (!libVal.evalIsEmpty(fsmQueryOptions)) {
                queryOption += ' and ' + fsmQueryOptions;
            }
            
            return libOperations.attachOperationsFilterByAssgnTypeOrWCM(context, queryOption + '&$top=2');
        });
    });
}
