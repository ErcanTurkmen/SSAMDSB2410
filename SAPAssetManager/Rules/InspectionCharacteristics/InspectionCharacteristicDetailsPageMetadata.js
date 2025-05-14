import ModifyKeyValueSection from '../LCNC/ModifyKeyValueSection';
import IsInspectionLotEnabled from '../WorkOrders/InspectionLot/IsInspectionLotEnabled';

export default async function InspectionCharacteristicDetailsPageMetadata(clientAPI) {
    let page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/InspectionCharacteristics/InspectionCharacteristicDetails.page');

    if (IsInspectionLotEnabled(clientAPI)) {
        return await ModifyKeyValueSection(clientAPI, page, 'CharacteristicDetailsSection');
    } else {
        return page;
    }
}
