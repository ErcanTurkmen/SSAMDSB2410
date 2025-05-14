import libVal from '../../Common/Library/ValidationLibrary';
import Logger from '../../Log/Logger';

export default function ApprovalsReadLink(context) {
    const binding = libVal.evalIsEmpty(context.binding) || !context.binding['@odata.readLink'] ? context.getPageProxy().binding : context.binding;
    const defaultReadLink = 'WCMApprovalProcesses';
    
    try {
        switch (binding['@odata.type']) {
            case '#sap_mobile.WCMApplication':
            case '#sap_mobile.WCMDocumentHeader':
                return binding['@odata.readLink'] + `/${defaultReadLink}`;
            default:
                return defaultReadLink;
        }
    } catch (error) {
        Logger.error('ApprovalsReadLink error', error);
        return defaultReadLink;
    }
}
