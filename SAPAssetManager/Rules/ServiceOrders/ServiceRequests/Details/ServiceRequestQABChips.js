import ServiceRequestQABSettings from './ServiceRequestQABSettings';

export default function ServiceRequestQABChips(context) {
    const QABSettings = new ServiceRequestQABSettings(context.getPageProxy());

    return QABSettings.generateChips();
}
