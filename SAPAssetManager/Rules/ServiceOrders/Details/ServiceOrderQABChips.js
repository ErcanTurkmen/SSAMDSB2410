import ServiceOrderQABSettings from './ServiceOrderQABSettings';

export default function ServiceOrderQABChips(context) {
    const QABSettings = new ServiceOrderQABSettings(context.getPageProxy());

    return QABSettings.generateChips();
}
