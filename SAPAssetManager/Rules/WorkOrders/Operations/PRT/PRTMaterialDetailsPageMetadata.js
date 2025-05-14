import ModifyKeyValueSection from '../../../LCNC/ModifyKeyValueSection';

export default async function PRTMaterialDetailsPageMetadata(clientAPI) {
    let page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/WorkOrders/Operations/PRT/PRTMaterialDetails.page');
    return await ModifyKeyValueSection(clientAPI, page, 'PRTMaterialDetailsSectionedTable');
}
