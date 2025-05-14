import { WorkOrderLibrary as libWO } from '../../WorkOrders/WorkOrderLibrary';
import libCom from '../../Common/Library/CommonLibrary';

/**
* Providing header with actual date info
* @param {IClientAPI} context
*/

export default function HeaderInfo(context) {
    // this rule is used only on FSM Overview classic, which doesn't have ability to work with date range
    // so that expecting that dates from libWO.getActualDates() would be equal, so we can just take lower bound
    const defaultDates = libWO.getActualDates(context);
    return libCom.relativeDayOfWeek(defaultDates.lowerBound, context) + ', ' + context.formatDate(defaultDates.lowerBound);
}
