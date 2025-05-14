import ModifyKeyValueSection from '../../../LCNC/ModifyKeyValueSection';

export default async function PRTMiscellaneousDetailsPageMetadata(clientAPI) {
    let page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/WorkOrders/Operations/PRT/PRTMiscellaneousDetails.page');
    return await ModifyKeyValueSection(clientAPI, page, 'PRTMiscellaneousDetailsSection');
}
