import ServiceQuotationQABSettings from '../ServiceQuotationQABSettings';

export default function ServiceQuotationQABChips(context) {
    const QABSettings = new ServiceQuotationQABSettings(context.getPageProxy());
    return QABSettings.generateChips();
}
