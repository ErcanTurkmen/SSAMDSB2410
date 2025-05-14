import ModifyKeyValueSection from '../LCNC/ModifyKeyValueSection';

export default async function PDMSIndicatorDetailsPageMetadata(clientAPI) {
    let page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/AssetCentral/PDMSIndicatorDetails.page');
    return await ModifyKeyValueSection(clientAPI, page, 'SectionKeyValue0');
}
