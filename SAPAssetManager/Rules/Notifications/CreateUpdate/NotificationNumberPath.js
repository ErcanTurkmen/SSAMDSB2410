import { NotificationDetailsPageName } from '../Details/NotificationDetailsPageToOpen';

export default function NotificationNumberPath(context) {
    return `#Page:${NotificationDetailsPageName(context)}/#Property:NotificationNumber`;
}
