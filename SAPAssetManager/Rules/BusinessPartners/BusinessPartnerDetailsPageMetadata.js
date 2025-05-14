import ModifyKeyValueSection from '../LCNC/ModifyKeyValueSection';

export default async function BusinessPartnerDetailsPageMetadata(clientAPI) {
    let page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/BusinessPartners/BusinessPartnerDetails.page');
    return await ModifyKeyValueSection(clientAPI, page, 'BusinessPartnerDetails');
}
