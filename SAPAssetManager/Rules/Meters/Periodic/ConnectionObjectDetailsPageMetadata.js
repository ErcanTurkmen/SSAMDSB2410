import ModifyKeyValueSection from '../../LCNC/ModifyKeyValueSection';

export default async function ConnectionObjectDetailsPageMetadata(clientAPI) {
    let page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/Meters/Periodic/ConnectionObjectDetails.page');
    return await ModifyKeyValueSection(clientAPI, page, 'ConnectionObjectDetails');
}
