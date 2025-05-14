import { WorkOrderLibrary as libWO } from '../WorkOrders/WorkOrderLibrary';
import libMobile from '../MobileStatus/MobileStatusLibrary';

export default function SupervisorModeSectionQueryOptionsForWO(context) {
    const { REVIEW, DISAPPROVED, APPROVED } = libMobile.getMobileStatusValueConstants(context);
    const queryOptions = Object.entries({
        expand: 'OrderMobileStatus_Nav/OverallStatusCfg_Nav',
        filter: [REVIEW, DISAPPROVED, APPROVED].map(status => `OrderMobileStatus_Nav/MobileStatus eq '${status}'`),
        top: '4',
    })
        .map(([key, value]) => `$${key}=${Array.isArray(value) ? value.join(' or ') : value}`)
        .join('&');

    return libWO.attachWorkOrdersFilterByAssgnTypeOrWCM(context, queryOptions);
}
