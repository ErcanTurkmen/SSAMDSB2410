import ApprovalTitle from './ApprovalTitle';

export default function IssueApprovalSignatureWatermarkText(context) {
    return ApprovalTitle(context)
        .then(title => {
            return [`${context.binding.Permit} - ${title}`, context.localizeText('issued_by_x', [context.evaluateTargetPath('#Application/#AppData/UserId')])].join('\n');
        });
}
