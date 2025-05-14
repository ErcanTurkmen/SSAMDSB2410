import ModifyKeyValueSection from '../../LCNC/ModifyKeyValueSection';

export default async function VehicleDetailsPageMetadata(clientAPI) {
    let page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/Crew/Vehicle/VehicleDetails.page');
    return await ModifyKeyValueSection(clientAPI, page, 'VehicleProperties');
}
