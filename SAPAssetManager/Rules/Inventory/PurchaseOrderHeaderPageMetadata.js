import ModifyKeyValueSection from '../LCNC/ModifyKeyValueSection';

export default async function PurchaseOrderHeaderPageMetadata(clientAPI) {
    let page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/Inventory/PurchaseOrder/PurchaseOrderHeader.page');
    return await ModifyKeyValueSection(clientAPI, page, 'PurchaseOrderHeaderPage');
}
