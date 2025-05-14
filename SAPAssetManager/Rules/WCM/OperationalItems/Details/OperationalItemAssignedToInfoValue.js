import CommonLibrary, { WCMAssignmentType } from '../../../Common/Library/CommonLibrary';
import { PartnerFunction } from '../../../Common/Library/PartnerFunction';
import AssignedToLibrary from '../../Common/AssignedToLibrary';

/** @param {IClientAPI} context */
export default function OperationalItemAssignedToInfoValue(context) {
    // 1. selection variant assignment -> isSelVar / assigned to me
    // 2. partner func assignment -> partner assigned to
    // 3. else '-'

    /** @type {WCMDocumentItem} */
    const binding = context.getPageProxy().binding;

    const assignments = new Set(CommonLibrary.getWCMDocumentAssignmentTypes(context));
    if ([WCMAssignmentType.SelectionVariant, WCMAssignmentType.OperationalList].some(x => assignments.has(x)) && binding.IsSelVar !== '') {
        return context.localizeText('wcm_assigned_to_me');
    } else if (assignments.has(WCMAssignmentType.PartnerFunction)) {
        const employeeRespPartners = (binding.WCMDocumentHeaders.WCMDocumentPartners || []).filter(p => p.PartnerFunction === PartnerFunction.getPersonnelPartnerFunction());
        return employeeRespPartners.length > 0 ? AssignedToLibrary.AssignedToPartnersLabel(context, employeeRespPartners) : '';
    }
    return '';
}
