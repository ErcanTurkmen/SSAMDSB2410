import ModifyKeyValueSection from '../../../LCNC/ModifyKeyValueSection';

export default async function ActivityDetailsPageMetadata(clientAPI) {
    let page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/WorkOrders/Meter/Activity/ActivityDetails.page');
    return await ModifyKeyValueSection(clientAPI, page, 'KeyValueTable');
}
