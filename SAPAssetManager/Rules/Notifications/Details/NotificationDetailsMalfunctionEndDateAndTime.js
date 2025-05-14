import libNotif from '../NotificationLibrary';

export default function NotificationDetailsMalfunctionEndDateAndTime(clientAPI) {
    return libNotif.notificationDetailsFieldFormat(clientAPI, 'MalfunctionEndDateAndTime');
}
