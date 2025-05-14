import libVal from '../../Common/Library/ValidationLibrary';
import WorkOrdersFSMQueryOption from '../../WorkOrders/ListView/WorkOrdersFSMQueryOption';
import { WorkOrderLibrary as libWO } from '../../WorkOrders/WorkOrderLibrary';

/**
* Restrict query options to get only service orders
*/
export default function OrderIdQueryOptions(context) {
    return WorkOrdersFSMQueryOption(context).then(fsmQueryOptions => {
        let queryOptions = '';
        if (!libVal.evalIsEmpty(fsmQueryOptions)) {
            queryOptions = '$filter=' + fsmQueryOptions;
        }
        return libWO.attachWorkOrdersFilterByAssgnTypeOrWCM(context, queryOptions);
    });
}
