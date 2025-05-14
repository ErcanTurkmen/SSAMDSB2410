
export default function IsDownloadNotificationButtonVisible(context) {
    const notificationStatus = context.binding.SystemStatus || '';
    const isNotitficationCompleted = notificationStatus.includes('NOCO'); //Hide button if contain status "Notification Completed"
    return !isNotitficationCompleted;
}
