import ModifyKeyValueSection from '../../../LCNC/ModifyKeyValueSection';

export default async function WarehouseOrderHeaderPageMetadata(clientAPI) {
    let page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/EWM/WarehouseOrders/WarehouseOrderHeader.page');
    return await ModifyKeyValueSection(clientAPI, page, 'KeyValueTable');
}
