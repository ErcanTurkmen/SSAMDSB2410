import ModifyKeyValueSection from '../LCNC/ModifyKeyValueSection';

export default async function PhysicalInventoryHeaderPageMetadata(clientAPI) {
    let page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/Inventory/PhysicalInventory/PhysicalInventoryHeader.page');
    return await ModifyKeyValueSection(clientAPI, page, 'KeyValueTable');
}
