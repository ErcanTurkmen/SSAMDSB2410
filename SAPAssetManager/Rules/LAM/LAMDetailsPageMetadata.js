import ModifyKeyValueSection from '../LCNC/ModifyKeyValueSection';

export default async function LAMDetailsPageMetadata(clientAPI) {
    let page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/LAM/LAMDetails.page');
    return await ModifyKeyValueSection(clientAPI, page, 'KeyValueTable');
}
