import ModifyKeyValueSection from '../../LCNC/ModifyKeyValueSection';

/**
 * allow modification of the key value section
 * @param {IClientAPI} clientAPI 
 * @returns modified page definition
 */
export default async function MaterialDocumentItemDetailsMetadata(clientAPI) {
    let page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/Inventory/MaterialDocument/MaterialDocumentItemDetails.page');
    return await ModifyKeyValueSection(clientAPI, page);
}
