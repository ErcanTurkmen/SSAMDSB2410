import IsLotoCertificate from '../Details/IsLotoCertificate';
import { WCMCertificateMobileStatuses } from '../SafetyCertificatesLibrary';


/** @param {IClientAPI & {binding: WCMDocumentHeader}} context  */
export default async function SetRevokePreparedIsVisible(context) {
    return await IsLotoCertificate(context) && await HasSupportedMobileStatus(context);
}

/** @param {IClientAPI & {binding: WCMDocumentHeader}} context  */
function HasSupportedMobileStatus(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'], [], '$expand=PMMobileStatus')
        .then(result => result.getItem(0))
        .then((/** @type {WCMDocumentHeader} */ cert) => [
            WCMCertificateMobileStatuses.Change, 
            WCMCertificateMobileStatuses.Prepared, 
            WCMCertificateMobileStatuses.Tag, 
            WCMCertificateMobileStatuses.Tagged, 
            WCMCertificateMobileStatuses.Tagprint,
        ].includes(cert.PMMobileStatus.MobileStatus));
}
