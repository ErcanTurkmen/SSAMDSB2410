import ApprovalStatusText from '../Common/ApprovalStatusText';

/** @param {IClientAPI & {binding: WCMDocumentHeader | WCMApplication}} context  */
export default function ApprovalsSectionFootnote(context) {
    const count = context.binding.approvalsCanBeIssuedCount;
    return count ? context.localizeText('waiting_for_your_approval_x', [count]) : ApprovalStatusText(context);
}
