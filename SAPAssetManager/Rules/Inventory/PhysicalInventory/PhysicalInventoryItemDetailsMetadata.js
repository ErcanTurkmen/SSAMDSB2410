import ModifyKeyValueSection from '../../LCNC/ModifyKeyValueSection';

export default async function PhysicalInventoryItemDetailsMetadata(clientAPI) {
    let page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/Inventory/PhysicalInventory/PhysicalInventoryItemDetails.page');
    return await ModifyKeyValueSection(clientAPI, page);
}
