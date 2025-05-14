import SubOperationHeaderPriority from './SubOperationHeaderPriority';
import SubOperationMobileStatus from '../MobileStatus/SubOperationMobileStatus';

export default function SubOperationHeaderSubstatusText(context) {
    return SubOperationHeaderPriority(context) ? SubOperationMobileStatus(context) : '';
}
