import OperationalItemQABSettings from './OperationalItemQABSettings';

export default function OperationalItemQABChips(context) {
    const QABSettings = new OperationalItemQABSettings(context.getPageProxy());

    return QABSettings.generateChips();
}
