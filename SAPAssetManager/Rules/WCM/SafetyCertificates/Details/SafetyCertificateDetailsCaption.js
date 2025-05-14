import libForm from '../../../Common/Library/FormatLibrary';

export default function SafetyCertificateDetailsCaption(context) {
    return libForm.formatDetailHeaderDisplayValue(context, context.binding.WCMDocument, 
        context.localizeText('safety_certificate_caption'));
}
