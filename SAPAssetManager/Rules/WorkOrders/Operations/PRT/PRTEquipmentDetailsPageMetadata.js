import ModifyKeyValueSection from '../../../LCNC/ModifyKeyValueSection';

export default async function PRTEquipmentDetailsPageMetadata(clientAPI) {
    let page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/WorkOrders/Operations/PRT/PRTEquipmentDetails.page');
    return await ModifyKeyValueSection(clientAPI, page, 'PRTEquipmentDetailsSection');
}
