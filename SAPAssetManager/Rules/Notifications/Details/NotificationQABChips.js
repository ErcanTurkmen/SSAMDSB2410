import NotificationQABSettings from './NotificationQABSettings';

export default function NotificationQABChips(context) {
    const QABSettings = new NotificationQABSettings(context.getPageProxy());

    return QABSettings.generateChips();
}
