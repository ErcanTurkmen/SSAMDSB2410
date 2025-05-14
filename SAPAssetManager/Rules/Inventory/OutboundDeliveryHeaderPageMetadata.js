import ModifyKeyValueSection from '../LCNC/ModifyKeyValueSection';

export default async function OutboundDeliveryHeaderPageMetadata(clientAPI) {
    let page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/Inventory/OutboundDelivery/OutboundDeliveryHeader.page');
    return await ModifyKeyValueSection(clientAPI, page, 'OutboundDeliveryHeaderPage');
}
