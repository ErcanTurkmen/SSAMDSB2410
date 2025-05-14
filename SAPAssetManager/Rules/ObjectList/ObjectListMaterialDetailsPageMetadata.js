import ModifyKeyValueSection from '../LCNC/ModifyKeyValueSection';

export default async function ObjectListMaterialDetailsPageMetadata(clientAPI) {
    let page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/ObjectList/ObjectListMaterialDetails.page');
    return await ModifyKeyValueSection(clientAPI, page, 'ObjectListMaterialDetailsSection');
}
