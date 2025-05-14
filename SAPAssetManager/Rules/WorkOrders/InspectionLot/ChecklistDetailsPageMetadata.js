import ModifyKeyValueSection from '../../LCNC/ModifyKeyValueSection';

export default async function ChecklistDetailsPageMetadata(clientAPI) {
    let page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/WorkOrders/InspectionLot/CheckListDetails.page');
    return await ModifyKeyValueSection(clientAPI, page, 'InspectionLotDetailsSection');
}
