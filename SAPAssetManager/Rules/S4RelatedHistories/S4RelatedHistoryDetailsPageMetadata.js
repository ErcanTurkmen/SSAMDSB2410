import ModifyKeyValueSection from '../LCNC/ModifyKeyValueSection';

export default async function S4RelatedHistoryDetailsPageMetadata(clientAPI) {
    let page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/S4RelatedHistories/S4RelatedHistoryDetails.page');
    return await ModifyKeyValueSection(clientAPI, page, 'S4RelatedHistoryDetailsSection');
}
