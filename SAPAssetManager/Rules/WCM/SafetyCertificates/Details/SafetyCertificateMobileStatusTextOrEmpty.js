import ValidationLibrary from '../../../Common/Library/ValidationLibrary';
import { GetMobileStatusLabel } from '../../OperationalItems/Details/OperationalItemMobileStatusTextOrEmpty';
import { WCMDocumentHeaderMobileStatusType } from '../SafetyCertificatesLibrary';

export default function SafetyCertificateMobileStatusTextOrEmpty(context) {
    return GetMobileStatusLabelOrNull(context, context.binding)
        .then(labelOrNull => labelOrNull || '');
}

/** @param {WCMDocumentHeader} cert  */
export function GetMobileStatusLabelOrNull(context, cert) {
    return (cert.PMMobileStatus ? Promise.resolve(cert.PMMobileStatus) : GetMobileStatus(context, cert))
        .then(pmMobileStatus => pmMobileStatus ? GetMobileStatusLabel(context, pmMobileStatus.MobileStatus, WCMDocumentHeaderMobileStatusType) : null);
}

export function GetMobileStatus(context, cert) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', cert['@odata.readLink'] + '/PMMobileStatus', [], '')
        .then(pmMobileStatus => ValidationLibrary.evalIsEmpty(pmMobileStatus) ? null : pmMobileStatus.getItem(0));  // single element is expected
}
