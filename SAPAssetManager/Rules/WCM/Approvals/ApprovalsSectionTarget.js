import { canIssueByHeaderStatus } from './PendingApprovalsTarget';
import ApprovalsReadLink from './ApprovalsReadLink';
import Logger from '../../Log/Logger';
import { ApprovalsQueryOptionsPending } from './ApprovalsQueryOptions';
import ValidationLibrary from '../../Common/Library/ValidationLibrary';


export default async function ApprovalsSectionTarget(context) {
    /** @type {WCMApplication | WCMDocumentHeader} */
    const binding = context.getPageProxy().binding;
    const wcmApplicationType = context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WCMApplication.global').getValue();
    const approved = context.getGlobalDefinition('/SAPAssetManager/Globals/WCM/TrafficLights/Approved.global').getValue();
    const cellBinding = {
        approvalsCanBeIssuedCount: 0,
    };

    if (binding['@odata.type'] !== wcmApplicationType || !canIssueByHeaderStatus(binding) || binding.TrafficLight === approved) {
        return [cellBinding];
    }

    const processes = await getPendingApprovals(context);
    if (ValidationLibrary.evalIsEmpty(processes)) {
        return [cellBinding];
    }

    cellBinding.approvalsCanBeIssuedCount = processes.filter(process => process.IsAuthorized === 'X').length;

    return [cellBinding];
}

/** @returns {Promise<ObservableArray<WCMApprovalProcess> | []>} */
async function getPendingApprovals(context) {
    let processes = [];
    try {
        processes = await context.read('/SAPAssetManager/Services/AssetManager.service', ApprovalsReadLink(context), ['IsAuthorized'], ApprovalsQueryOptionsPending());
    } catch (error) {
        Logger.error('getPendingApprovals error', error);
    }

    return processes;
}
