import ConfirmationItemQABSettings from './ConfirmationItemQABSettings';

export default function ConfirmationItemQABChips(context) {
    const QABSettings = new ConfirmationItemQABSettings(context.getPageProxy());

    return QABSettings.generateChips();
}
