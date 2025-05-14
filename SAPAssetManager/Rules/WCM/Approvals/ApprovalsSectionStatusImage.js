
/** @param {IClientAPI & {binding: WCMDocumentHeader | WCMApplication}} context  */
export default function ApprovalsSectionStatusImage(context) {
    return context.binding.approvalsCanBeIssuedCount ? '/SAPAssetManager/Images/waiting_approval.png' : undefined;
}
