import ModifyKeyValueSection from '../../../LCNC/ModifyKeyValueSection';

export default async function VoyagesHeaderPageMetadata(clientAPI) {
    let page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/FL/Voyages/VoyagesHeader.page');
    return await ModifyKeyValueSection(clientAPI, page, 'KeyValueTable');
}
