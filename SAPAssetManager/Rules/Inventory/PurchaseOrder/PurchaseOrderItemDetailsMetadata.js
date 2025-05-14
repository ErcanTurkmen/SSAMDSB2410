import ModifyKeyValueSection from '../../LCNC/ModifyKeyValueSection';

/**
 * allow modification of the key value section
 * @param {IClientAPI} clientAPI 
 * @returns modified page definition
 */
export default async function PurchaseOrderItemDetailsMetadata(clientAPI) {
    const page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/Inventory/PurchaseOrder/PurchaseOrderItemDetails.page');
    return await ModifyKeyValueSection(clientAPI, page);
}
