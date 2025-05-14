import ModifyKeyValueSection from '../../LCNC/ModifyKeyValueSection';

export default async function PurchaseRequisitionItemDetailsPageMetadata(clientAPI) {
    let page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/Inventory/PurchaseRequisition/PurchaseRequisitionItemDetails.page');
    return await ModifyKeyValueSection(clientAPI, page);
}
