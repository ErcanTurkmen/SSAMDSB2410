export default function PendingApprovalStatusImage(context) {
    return context.binding.canBeIssued ? '/SAPAssetManager/Images/waiting_approval.png' : undefined;
}
