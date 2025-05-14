import ModifyKeyValueSection from '../../LCNC/ModifyKeyValueSection';

export default async function ReservationItemProductionOrderComponentDetailsMetadata(clientAPI) {
    let page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/Inventory/Reservation/ReservationItemProductionOrderComponentDetails.page');
    return await ModifyKeyValueSection(clientAPI, page);
}
