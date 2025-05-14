import ApprovalsReadLink from './ApprovalsReadLink';
import { ApprovalsQueryOptionsPending } from './ApprovalsQueryOptions';
import { WCMSystemStatuses } from '../SafetyCertificates/SafetyCertificatesLibrary';
import ValidationLibrary from '../../Common/Library/ValidationLibrary';

export default async function PendingApprovalsTarget(context) {
    /** @type {WCMApplication | WCMDocumentHeader} */
    const binding = context.getPageProxy().binding;
    const tPermit = context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WCMApplication.global').getValue();

    return context.read('/SAPAssetManager/Services/AssetManager.service', ApprovalsReadLink(context), [], ApprovalsQueryOptionsPending())
        .then((/** @type {WCMApprovalProcess} */ processes) => {
            if (ValidationLibrary.evalIsEmpty(processes)) {
                return [];
            }

            // only workpermit approval issue is supported for now
            const isWorkPermit = tPermit === binding['@odata.type'];
            const isIssueActionEnabled = isWorkPermit && canIssueByHeaderStatus(binding);
            const lowestPendingCounter = processes.getItem(0).Counter;  // processes are sorted by Counter, and all are pending

            return Promise.all(Array.from(processes, async (/** @type {WCMApprovalProcess} */ p) => {
                let canBeIssued = false;
                if (isIssueActionEnabled) {
                    canBeIssued = p.IsAuthorized === 'X' && p.Counter === lowestPendingCounter;
                }

                return { ...p, canBeIssued };
            }));
        });
}

/** @param {WCMDocumentHeader | WCMApplication} binding  */
export function canIssueByHeaderStatus(binding) {
    return binding.ActualSystemStatus === WCMSystemStatuses.Prepared;
}
