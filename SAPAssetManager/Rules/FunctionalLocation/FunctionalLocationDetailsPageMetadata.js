import ModifyKeyValueSection from '../LCNC/ModifyKeyValueSection';

export default async function FunctionalLocationDetailsPageMetadata(clientAPI) {
    let page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/FunctionalLocation/FunctionalLocationDetails.page');
    return await ModifyKeyValueSection(clientAPI, page, 'KeyValueTable');
}
