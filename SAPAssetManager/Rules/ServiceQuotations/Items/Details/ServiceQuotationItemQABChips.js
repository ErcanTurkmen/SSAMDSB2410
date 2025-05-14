import ServiceQuotationItemQABSettings from '../ServiceQuotationItemQABSettings';

export default function ServiceQuotationItemQABChips(context) {
    const QABSettings = new ServiceQuotationItemQABSettings(context.getPageProxy());
    return QABSettings.generateChips();
}
