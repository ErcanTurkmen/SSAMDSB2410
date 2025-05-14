import ModifyKeyValueSection from '../LCNC/ModifyKeyValueSection';

export default async function EquipmentDetailsPageMetadata(clientAPI) {
    let page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/Equipment/EquipmentDetails.page');
    return await ModifyKeyValueSection(clientAPI, page, 'KeyValueTable');
}
