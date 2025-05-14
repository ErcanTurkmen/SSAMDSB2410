import ModifyKeyValueSection from '../../../LCNC/ModifyKeyValueSection';
 
export default async function PackagesHeaderPageMetadata(clientAPI) {
    let page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/FL/Packages/PackagesHeader.page');
    return await ModifyKeyValueSection(clientAPI, page, 'KeyValueTable');
}
