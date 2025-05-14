import IsApprovalSignatureEnabled from './IsApprovalSignatureEnabled';
import IssueApproval from './IssueApproval';

export default function IssueApprovalOnPress(context) {
    return IsApprovalSignatureEnabled(context) ? context.executeAction('/SAPAssetManager/Actions/WCM/Approvals/IssueApprovalNav.action') : IssueApproval(context);
}
