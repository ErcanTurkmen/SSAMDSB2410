import WCMDocumentItemSequence from './WCMDocumentItemSequence';

export default function CertificateIdSequence(context) {
    return `${context.localizeText('operational_item')} ${context.binding.WCMDocument}_${WCMDocumentItemSequence(context, context.binding)}`;
}
