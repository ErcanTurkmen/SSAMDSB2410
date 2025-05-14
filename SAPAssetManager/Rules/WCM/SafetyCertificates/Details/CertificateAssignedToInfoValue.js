import CommonLibrary from '../../../Common/Library/CommonLibrary';
import AssignedToLibrary from '../../Common/AssignedToLibrary';

export default function CertificateAssignedToInfoValue(context) {
    /** @type {WCMDocumentHeader} */
    const binding = context.getPageProxy().binding;
    return AssignedToLibrary.GetAssignedToInfoValue(context, AssignedToLibrary.IsAssignedToVisibleByAssignmentsCertificate(CommonLibrary.getWCMDocumentAssignmentTypes(context)), binding.WCMDocumentPartners);
}
