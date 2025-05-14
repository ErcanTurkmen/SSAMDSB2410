import ModifyKeyValueSection from '../LCNC/ModifyKeyValueSection';

export default async function STOrderHeaderPageMetadata(clientAPI) {
    let page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/Inventory/StockTransportOrder/STOrderHeader.page');
    return await ModifyKeyValueSection(clientAPI, page, 'STOrderHeaderPage');
}
