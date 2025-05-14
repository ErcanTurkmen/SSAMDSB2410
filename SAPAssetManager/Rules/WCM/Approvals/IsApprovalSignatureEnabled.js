import libCommon from '../../Common/Library/CommonLibrary';

export default function IsApprovalSignatureEnabled(context) {
    return libCommon.getAppParam(context, 'WCM', 'ApprovalIssue.SignatureMandatory') === 'Y';
}
