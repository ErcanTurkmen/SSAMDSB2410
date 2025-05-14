import REUSABLE_FAST_FILTERS from '../Common/ReusableFastFilters';
import libAssignedTo from '../Common/AssignedToLibrary';
import CommonLibrary from '../../Common/Library/CommonLibrary';


export default function SafetyCertificatesFastFilters(context) {
    const isPartnerEnabled = libAssignedTo.IsAssignedToVisibleByAssignmentsCertificate(CommonLibrary.getWCMDocumentAssignmentTypes(context));
    const filters = isPartnerEnabled ? [
        {
            ...REUSABLE_FAST_FILTERS.ASSIGNED_TO_ME,
            ReturnValue: libAssignedTo.GetAssignedToMeReturnValue('WCMDocumentPartners'),
        },
    ] : [];
    return [
        ...filters,
        REUSABLE_FAST_FILTERS.APPROVED,
        REUSABLE_FAST_FILTERS.VERY_HIGH_PRIORITY,
    ];
}
