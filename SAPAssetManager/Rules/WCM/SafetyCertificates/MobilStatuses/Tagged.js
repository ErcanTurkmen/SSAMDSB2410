import { GetMobileStatusLabel } from '../../OperationalItems/Details/OperationalItemMobileStatusTextOrEmpty';
import { WCMCertificateMobileStatuses, WCMDocumentHeaderMobileStatusType } from '../SafetyCertificatesLibrary';

export default (context) => GetMobileStatusLabel(context, WCMCertificateMobileStatuses.Tagged, WCMDocumentHeaderMobileStatusType);
