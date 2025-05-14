import ModifyKeyValueSection from '../LCNC/ModifyKeyValueSection';

export default async function MaterialDocumentHeaderPageMetadata(clientAPI) {
    let page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/Inventory/MaterialDocument/MaterialDocumentHeader.page');
    return await ModifyKeyValueSection(clientAPI, page, 'MaterialDocumentHeaderPage');
}
