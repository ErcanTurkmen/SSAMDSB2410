import ModifyKeyValueSection from '../../LCNC/ModifyKeyValueSection';

export default async function InspectionLotDetailsPageMetadata(clientAPI) {
    let page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/WorkOrders/InspectionLot/InspectionLotDetails.page');
    return await ModifyKeyValueSection(clientAPI, page, 'MainKeyValueSection');
}
