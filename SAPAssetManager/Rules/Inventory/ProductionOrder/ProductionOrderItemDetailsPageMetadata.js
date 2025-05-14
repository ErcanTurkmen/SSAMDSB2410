import ModifyKeyValueSection from '../../LCNC/ModifyKeyValueSection';

export default async function ProductionOrderItemDetailsPageMetadata(clientAPI) {
    let page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/Inventory/ProductionOrder/ProductionOrderItemDetails.page');
    return await ModifyKeyValueSection(clientAPI, page);
}

