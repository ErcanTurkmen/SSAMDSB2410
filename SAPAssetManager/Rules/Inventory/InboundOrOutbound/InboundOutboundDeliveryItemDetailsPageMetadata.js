import ModifyKeyValueSection from '../../LCNC/ModifyKeyValueSection';

export default async function InboundOutboundDeliveryItemDetailsPageMetadata(clientAPI) {
    let page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/Inventory/InboundOutbound/InboundOutboundDeliveryItemDetails.page');
    return await ModifyKeyValueSection(clientAPI, page);
}
