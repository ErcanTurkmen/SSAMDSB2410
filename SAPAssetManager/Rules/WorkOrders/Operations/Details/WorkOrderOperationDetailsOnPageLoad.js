import WorkOrderCompleted from '../../Details/WorkOrderDetailsOnPageLoad';

export default function WorkOrderOperationDetailsOnPageLoad(pageClientAPI) {
    // handle the action bar items visiblity based on Work Order status
    return WorkOrderCompleted(pageClientAPI);
}
