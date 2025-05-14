import ModifyKeyValueSection from '../../LCNC/ModifyKeyValueSection';

export default async function SafetyCertificateDetailsPageMetadata(clientAPI) {
    let page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/WCM/SafetyCertificates/SafetyCertificateDetails.page');
    return await ModifyKeyValueSection(clientAPI, page, 'CertificateDetailsSection');
}
