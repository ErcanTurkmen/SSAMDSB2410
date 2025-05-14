import EnableNotificationCreate from '../../UserAuthorizations/Notifications/EnableNotificationCreate';
import DocumentsIsVisible from '../../Documents/DocumentsIsVisible';
import IsLotoCertificate from '../SafetyCertificates/Details/IsLotoCertificate';
import IsQABIssueApprovalsVisible from './IsQABIssueApprovalsVisible';

export default async function WCMQABDetailsPageIsVisible(context) {
    return EnableNotificationCreate(context) || DocumentsIsVisible(context) || IsQABIssueApprovalsVisible(context) || await IsLotoCertificate(context);
}
