import WorkOrderConfirmationsQueryOptions from './WorkOrderConfirmationsQueryOptions';

export default function WorkOrderDetailsConfirmationsQueryOptions(context) {
    return WorkOrderConfirmationsQueryOptions(context, 'StartTimeStamp desc', 2);
}
