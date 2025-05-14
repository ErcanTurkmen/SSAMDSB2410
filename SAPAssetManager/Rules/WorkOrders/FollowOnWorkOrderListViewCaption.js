import CommonLibrary from '../Common/Library/CommonLibrary';
import { WorkOrderLibrary as libWO } from './WorkOrderLibrary';

export default function FollowOnWorkOrderListViewCaption(context) {
    let reference = context.getPageProxy().binding.OrderId;
    let filterText = CommonLibrary.getStateVariable(context, 'WORKORDER_FILTER');

    let allQueryOptions = `$filter=ReferenceOrder eq '${reference}'`;
    let filteredQueryOption = allQueryOptions;
    if (filterText !== '$filter=') {
        filteredQueryOption = `${filterText} and ReferenceOrder eq '${reference}'`;
    }

    let promises = [];
    promises.push(CommonLibrary.getEntitySetCount(context, 'MyWorkOrderHeaders', libWO.attachWorkOrdersFilterByAssgnTypeOrWCM(context, allQueryOptions)));
    promises.push(CommonLibrary.getEntitySetCount(context, 'MyWorkOrderHeaders', libWO.attachWorkOrdersFilterByAssgnTypeOrWCM(context, filteredQueryOption)));
    return Promise.all(promises).then(results => {
        let totalCount = results[0];
        let filteredCount = results[1];
        context.getPageProxy().getClientData().Count = totalCount;

        if (totalCount === filteredCount) {
            return context.localizeText('work_order_x', [totalCount]);
        } else {
            return context.localizeText('work_order_x_x', [filteredCount, totalCount]);
        }
    });
}
