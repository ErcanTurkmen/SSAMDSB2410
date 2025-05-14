import ConfirmationQABSettings from './ConfirmationQABSettings';

export default function ConfirmationQABChips(context) {
    const QABSettings = new ConfirmationQABSettings(context.getPageProxy());

    return QABSettings.generateChips();
}
