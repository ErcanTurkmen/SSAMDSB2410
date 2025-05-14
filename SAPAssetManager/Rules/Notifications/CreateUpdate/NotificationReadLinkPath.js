import { NotificationDetailsPageName } from '../Details/NotificationDetailsPageToOpen';

export default function NotificationReadLinkPath(context) {
    return `#Page:${NotificationDetailsPageName(context)}/#Property:@odata.readLink`;
}
