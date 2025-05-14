import ModifyKeyValueSection from '../../LCNC/ModifyKeyValueSection';

export default async function CharacteristicsPageMetadata(clientAPI) {
    let page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/Classification/Characteristics/CharacteristicValueDetails.page');
    return await ModifyKeyValueSection(clientAPI, page, 'KeyValueTable');
}
