import ModifyKeyValueSection from '../../LCNC/ModifyKeyValueSection';

export default async function ServiceRequestDetailsPageMetadata(clientAPI) {
    let page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/ServiceOrders/ServiceRequests/ServiceRequestDetails.page');
    return await ModifyKeyValueSection(clientAPI, page, 'RequestDetailsSection');
}
