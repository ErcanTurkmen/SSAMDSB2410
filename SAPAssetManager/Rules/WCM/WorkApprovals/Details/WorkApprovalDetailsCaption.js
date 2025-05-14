import libForm from '../../../Common/Library/FormatLibrary';

export default function WorkApprovalDetailsCaption(context) {
    let binding = context.binding;
    return libForm.formatDetailHeaderDisplayValue(context, binding.WCMApproval, 
        context.localizeText('work_approval'));
}
