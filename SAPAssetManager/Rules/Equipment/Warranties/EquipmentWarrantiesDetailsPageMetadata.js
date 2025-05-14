import ModifyKeyValueSection from '../../LCNC/ModifyKeyValueSection';

export default async function EquipmentWarrantiesDetailsPageMetadata(clientAPI) {
    let page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/Equipment/Warranties/EquipmentWarrantiesDetails.page');
    return await ModifyKeyValueSection(clientAPI, page, 'EquipmentWarrantiesDetailsSection');
}
