import { WCMCertificateMobileStatuses } from '../SafetyCertificatesLibrary';


/** @param {IClientAPI & {binding: WCMDocumentHeader}} context  */
export default function SetRevokePreparedCaption(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'], [], '$expand=PMMobileStatus')
        .then(result => result.getItem(0))
        .then((/** @type {WCMDocumentHeader} */ cert) => {
            const revokePreparedLabel = context.localizeText('revoke_prepared');
            return {
                [WCMCertificateMobileStatuses.Prepared]: revokePreparedLabel,
                [WCMCertificateMobileStatuses.Tag]: revokePreparedLabel,
                [WCMCertificateMobileStatuses.Tagged]: revokePreparedLabel,
                [WCMCertificateMobileStatuses.Tagprint]: revokePreparedLabel,
                [WCMCertificateMobileStatuses.Change]: context.localizeText('set_prepared'),
            }[cert.PMMobileStatus.MobileStatus] || '';
        });
}
