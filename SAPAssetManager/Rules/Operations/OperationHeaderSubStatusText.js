import OperationMobileStatus from '../MobileStatus/OperationMobileStatus';
import OperationHeaderPriority from './OperationHeaderPriority';

/** @param {IPageProxy & {binding: MyWorkOrderOperation}} context  */
export default function OperationHeaderSubStatusText(context) {
    return OperationHeaderPriority(context) ? OperationMobileStatus(context) : '';
}
