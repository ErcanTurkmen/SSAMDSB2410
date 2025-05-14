import ModifyKeyValueSection from '../../LCNC/ModifyKeyValueSection';

export default async function ServiceOrganizationDetailsPageMetadata(clientAPI) {
    let page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/ServiceOrders/ServiceOrganization/ServiceOrganizationDetails.page');
    return await ModifyKeyValueSection(clientAPI, page, 'ServiceSection');
}
