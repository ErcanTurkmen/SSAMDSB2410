import ModifyKeyValueSection from '../../../LCNC/ModifyKeyValueSection';

export default async function InspectionPointDetailsPageMetadata(clientAPI) {
    let page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/WorkOrders/Operations/InspectionPoints/InspectionPointDetails.page');
    return await ModifyKeyValueSection(clientAPI, page, 'InspectionPointDetailsSection');
}
