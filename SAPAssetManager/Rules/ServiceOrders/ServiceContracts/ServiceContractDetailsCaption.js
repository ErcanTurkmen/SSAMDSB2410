import libForm from '../../Common/Library/FormatLibrary';

export default function ServiceContractDetailsCaption(context) {
    const binding = context.binding;
    return libForm.formatDetailHeaderDisplayValue(context, binding.ObjectID, context.localizeText('service_contract'));
}
