import ModifyKeyValueSection from '../LCNC/ModifyKeyValueSection';

export default async function InboundDeliveryHeaderPageMetadata(clientAPI) {
    let page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/Inventory/Inbound/InboundDeliveryHeader.page');
    return await ModifyKeyValueSection(clientAPI, page, 'OutboundDeliveryHeaderPage');
}
