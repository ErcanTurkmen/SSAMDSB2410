import ModifyKeyValueSection from '../LCNC/ModifyKeyValueSection';

export default async function WorkOrderHistoryDetailsPageMetadata(clientAPI) {
    let page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/WorkOrders/WorkOrderHistoryDetails.page');
    return await ModifyKeyValueSection(clientAPI, page, 'WorkOrderHistoryDetailsSection');
}
