import { WCMCertificateMobileStatuses } from '../SafetyCertificates/SafetyCertificatesLibrary';

const REUSABLE_FAST_FILTERS = {
    VERY_HIGH_PRIORITY: {
        '_Name': 'VeryHighPriority',
        '_Type': 'Control.Type.FastFilterItem',
        'FilterType': 'Filter',
        'FilterProperty': 'Priority',
        'DisplayValue': '/SAPAssetManager/Rules/WCM/Common/PriorityVeryHighText.js',
        'ReturnValue': '/SAPAssetManager/Globals/Priorities/VeryHigh.global',
    },
    WORK_PERMIT_PRINTED: {
        '_Name': 'WorkPermitPrinted',
        '_Type': 'Control.Type.FastFilterItem',
        'FilterType': 'Filter',
        'FilterProperty': 'ActualSystemStatus',
        'DisplayValue': '/SAPAssetManager/Rules/WCM/Common/StatusWorkPermitPrintedText.js',
        'ReturnValue': '/SAPAssetManager/Globals/SystemStatuses/WorkPermitPrinted.global',
    },
    APPROVED: {
        '_Name': 'Approved',
        '_Type': 'Control.Type.FastFilterItem',
        'FilterType': 'Filter',
        'FilterProperty': 'TrafficLight',
        'DisplayValue': '$(L, wcm_approved)',
        'ReturnValue': '0',
    },
    ASSIGNED_TO_ME: {
        '_Name': 'AssignedToMe',
        '_Type': 'Control.Type.FastFilterItem',
        'FilterType': 'Filter',
        'DisplayValue': '$(L, assigned_to_me)',
        'CustomQueryGroup': 'AssignedToQuery',
        'ReturnValue': '', //replace with value according to entity type
    },
};

export default REUSABLE_FAST_FILTERS;

export const WCMDocumentHeaderFastFilters = Object.freeze({
    TAG_PRINTED: {
        '_Name': 'TagPrinted',
        '_Type': 'Control.Type.FastFilterItem',
        'FilterType': 'Filter',
        'FilterProperty': 'PMMobileStatus/MobileStatus',
        'DisplayValue': '/SAPAssetManager/Rules/WCM/SafetyCertificates/MobilStatuses/TagPrinted.js',
        'ReturnValue': WCMCertificateMobileStatuses.Tagprint,
    },
    UNTAG: {
        '_Name': 'Untag',
        '_Type': 'Control.Type.FastFilterItem',
        'FilterType': 'Filter',
        'FilterProperty': 'PMMobileStatus/MobileStatus',
        'DisplayValue': '/SAPAssetManager/Rules/WCM/SafetyCertificates/MobilStatuses/Untag.js',
        'ReturnValue': WCMCertificateMobileStatuses.Untag,
    },
    TAG: {
        '_Name': 'Tag',
        '_Type': 'Control.Type.FastFilterItem',
        'FilterType': 'Filter',
        'FilterProperty': 'PMMobileStatus/MobileStatus',
        'DisplayValue': '/SAPAssetManager/Rules/WCM/SafetyCertificates/MobilStatuses/Tag.js',
        'ReturnValue': WCMCertificateMobileStatuses.Tag,
    },
    TAGGED: {
        '_Name': 'Tagged',
        '_Type': 'Control.Type.FastFilterItem',
        'FilterType': 'Filter',
        'FilterProperty': 'PMMobileStatus/MobileStatus',
        'DisplayValue': '/SAPAssetManager/Rules/WCM/SafetyCertificates/MobilStatuses/Tagged.js',
        'ReturnValue': WCMCertificateMobileStatuses.Tagged,
    },
});
