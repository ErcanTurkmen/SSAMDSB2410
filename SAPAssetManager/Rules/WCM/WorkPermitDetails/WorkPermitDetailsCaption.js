import libForm from '../../Common/Library/FormatLibrary';

export default function WorkPermitDetailsCaption(context) {
    return libForm.formatDetailHeaderDisplayValue(context, context.binding.WCMApplication, context.localizeText('wcm_work_permit'));
}
