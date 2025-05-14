import ModifyKeyValueSection from '../../LCNC/ModifyKeyValueSection';

export default async function ItemDetailsPageMetadata(clientAPI) {
    let page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/Inventory/Item/ItemDetails.page');
    return await ModifyKeyValueSection(clientAPI, page);

}
