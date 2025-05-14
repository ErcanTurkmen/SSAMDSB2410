
export default function ApprovalCanBeIssued(context) {
    return !!context.binding.canBeIssued;
}
