import ModifyKeyValueSection from '../../../LCNC/ModifyKeyValueSection';

export default async function ContainersHeaderPageMetadata(clientAPI) {
    let page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/FL/Containers/ContainersHeader.page');
    return await ModifyKeyValueSection(clientAPI, page, 'KeyValueTable');
}
