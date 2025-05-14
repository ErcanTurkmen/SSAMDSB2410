import ModifyKeyValueSection from '../../LCNC/ModifyKeyValueSection';

export default async function RelatedActivitiesPageMetadata(clientAPI) {
    let page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/WorkOrders/Meter/RelatedActivities.page');
    return await ModifyKeyValueSection(clientAPI, page, 'DocumentDetailsSection');
}
