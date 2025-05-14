import libNotif from '../NotificationLibrary';

export default function NotificationDetailsFailureGroupAndMode(context) {
    return libNotif.notificationDetailsFieldFormat(context, 'FailureGroupAndMode');
}
