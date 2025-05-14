import ModifyKeyValueSection from '../LCNC/ModifyKeyValueSection';

export default async function ProductionOrderHeaderPageMetadata(clientAPI) {
    let page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/Inventory/ProductionOrder/ProductionOrderHeader.page');
    return await ModifyKeyValueSection(clientAPI, page, 'KeyValueTable');
}
