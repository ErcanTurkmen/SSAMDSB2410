import ModifyKeyValueSection from '../../LCNC/ModifyKeyValueSection';

export default async function StockDetailsPageMetadata(clientAPI) {
    let page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/Inventory/Stock/StockDetails.page');
    return await ModifyKeyValueSection(clientAPI, page, 'StockDetailsKevyValueSection');
}
