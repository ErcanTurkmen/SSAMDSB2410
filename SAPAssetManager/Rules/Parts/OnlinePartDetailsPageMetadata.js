import ModifyKeyValueSection from '../LCNC/ModifyKeyValueSection';

export default async function PartDetailsPageMetadata(clientAPI) {
    let page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/Parts/OnlinePartDetails.page');
    return await ModifyKeyValueSection(clientAPI, page, 'KeyValuePairs');
}
