import libNotif from '../NotificationLibrary';

export default function NotificationDetailsMalfunctionStartDateAndTime(clientAPI) {
    return libNotif.notificationDetailsFieldFormat(clientAPI, 'MalfunctionStartDateAndTime');
}
