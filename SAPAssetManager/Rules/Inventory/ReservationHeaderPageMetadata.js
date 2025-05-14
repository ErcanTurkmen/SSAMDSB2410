import ModifyKeyValueSection from '../LCNC/ModifyKeyValueSection';

export default async function ReservationHeaderPageMetadata(clientAPI) {
    let page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/Inventory/Reservation/ReservationHeader.page');
    return await ModifyKeyValueSection(clientAPI, page, 'KeyValueTable');
}
