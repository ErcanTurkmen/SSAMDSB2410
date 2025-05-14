import BusinessPartnerQABSettings from './BusinessPartnerQABSettings';

export default function BusinessPartnerQABChips(context) {
    const QABSettings = new BusinessPartnerQABSettings(context.getPageProxy());

    return QABSettings.generateChips();
}
