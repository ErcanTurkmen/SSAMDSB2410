import REUSABLE_FAST_FILTERS from '../Common/ReusableFastFilters';
import libAssignedTo from '../Common/AssignedToLibrary';
import CommonLibrary from '../../Common/Library/CommonLibrary';


export default function WorkPermitsFastFilters(context) {
    const isPartnerEnabled = libAssignedTo.IsAssignedToVisibleByAssignmentsWorkPermit(CommonLibrary.getWCMApplicationAssignmentTypes(context));
    const filters = isPartnerEnabled ? [
        {
            ...REUSABLE_FAST_FILTERS.ASSIGNED_TO_ME,
            ReturnValue: libAssignedTo.GetAssignedToMeReturnValue('WCMApplicationPartners'),
        },
    ] : [];
    return [
        ...filters,
        REUSABLE_FAST_FILTERS.VERY_HIGH_PRIORITY,
        REUSABLE_FAST_FILTERS.WORK_PERMIT_PRINTED,
        REUSABLE_FAST_FILTERS.APPROVED,
        {
            '_Name': 'Closed',
            '_Type': 'Control.Type.FastFilterItem',
            'FilterType': 'Filter',
            'FilterProperty': 'ActualSystemStatus',
            'DisplayValue': '/SAPAssetManager/Rules/WCM/Common/StatusClosedText.js',
            'ReturnValue': '/SAPAssetManager/Globals/SystemStatuses/Closed.global',
        },
        {
            '_Name': 'HandedOut',
            '_Type': 'Control.Type.FastFilterItem',
            'FilterType': 'Filter',
            'FilterProperty': 'ActualSystemStatus',
            'DisplayValue': '/SAPAssetManager/Rules/WCM/WorkPermits/StatusWorkPermitHandedOutText.js',
            'ReturnValue': '/SAPAssetManager/Globals/SystemStatuses/HandedOut.global',
        },
    ];
}
