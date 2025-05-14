import ModifyKeyValueSection from '../../LCNC/ModifyKeyValueSection';

export default async function BOMDetailsPageMetadata(clientAPI) {
    let page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/Parts/BOM/BOMDetails.page');
    return await ModifyKeyValueSection(clientAPI, page, 'KeyValuePairs');
}
