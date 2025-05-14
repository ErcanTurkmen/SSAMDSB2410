import libCommon from '../../Common/Library/CommonLibrary';

export default function IssueApprovalRequiredFieldsOnFailure(context) {
    context.getMissingRequiredControls().forEach(control => {
        libCommon.executeInlineControlError(context, control, context.localizeText('field_is_required'));
    });
}
