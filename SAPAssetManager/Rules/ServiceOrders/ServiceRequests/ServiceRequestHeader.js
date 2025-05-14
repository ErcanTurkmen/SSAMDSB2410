import libForm from '../../Common/Library/FormatLibrary';

export default function ServiceRequestHeader(context) {
    return libForm.formatDetailHeaderDisplayValue(context, context.binding.ObjectID, context.localizeText('service_request'));
}
