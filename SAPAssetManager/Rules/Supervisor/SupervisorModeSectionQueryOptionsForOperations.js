import { OperationLibrary as libOperations } from '../WorkOrders/Operations/WorkOrderOperationLibrary';
import libMobile from '../MobileStatus/MobileStatusLibrary';

export default function SupervisorModeSectionQueryOptionsForOperations(context) {
    const { REVIEW, DISAPPROVED, APPROVED } = libMobile.getMobileStatusValueConstants(context);
    const queryOptions = Object.entries({
        expand: 'WOHeader,OperationMobileStatus_Nav/OverallStatusCfg_Nav',
        filter: [REVIEW, DISAPPROVED, APPROVED].map(status => `OperationMobileStatus_Nav/MobileStatus eq '${status}'`),
        top: '4',
    })
        .map(([key, value]) => `$${key}=${Array.isArray(value) ? value.join(' or ') : value}`)
        .join('&');

    return libOperations.attachOperationsFilterByAssgnTypeOrWCM(context, queryOptions);
}
