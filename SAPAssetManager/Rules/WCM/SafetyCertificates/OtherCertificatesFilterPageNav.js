import CommonLibrary from '../../Common/Library/CommonLibrary';
import AssignedToLibrary from '../Common/AssignedToLibrary';
import { WCMCertificateMobileStatuses } from './SafetyCertificatesLibrary';

/** @param {IPageProxy} context  */
export default function OtherCertificatesFilterPageNav(context) {
    const assignments = CommonLibrary.getWCMDocumentAssignmentTypes(context);
    /** @type {import('../../Filter/FilterLibrary').FilterPageBinding & import('../Common/AssignedToLibrary').TypeAssignedToBinding} */
    const binding = {
        notAllowedStatuses: [WCMCertificateMobileStatuses.Tag, WCMCertificateMobileStatuses.Tagprint, WCMCertificateMobileStatuses.Tagged, WCMCertificateMobileStatuses.Untag, WCMCertificateMobileStatuses.Untagged],
        DefaultValues: { SortFilter: 'Priority' },
        assignmentTypes: assignments,
        PartnersNavPropName: 'WCMDocumentPartners',
        AssignedToMePickerItem: GetWCMCertificateAssignedToMePickerItem(assignments, context),
    };
    context.setActionBinding(binding);
    return context.executeAction('/SAPAssetManager/Actions/WCM/SafetyCertificatesFilter.action');
}

export function GetWCMCertificateAssignedToMePickerItem(assignments, context) {
    return AssignedToLibrary.IsAssignedToVisibleByAssignmentsCertificate(assignments) ? {
        DisplayValue: context.localizeText('assigned_to_me'),
        ReturnValue: AssignedToLibrary.GetAssignedToMeReturnValue('WCMDocumentPartners'),
    } : undefined;
}

