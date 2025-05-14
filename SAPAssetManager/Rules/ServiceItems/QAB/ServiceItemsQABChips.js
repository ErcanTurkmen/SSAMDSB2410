import ServiceItemsQABSettings from './ServiceItemsQABSettings';

export default function ServiceItemsQABChips(context) {
    const QABSettings = new ServiceItemsQABSettings(context.getPageProxy());

    return QABSettings.generateChips();
}
