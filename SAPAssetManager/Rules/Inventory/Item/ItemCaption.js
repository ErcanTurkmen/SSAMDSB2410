
/** @param {{binding: import('./ItemsData').ItemDetailsBinding}} context  */
export default function ItemCaption(context) {
    const item = context.binding.item;
    const type = item['@odata.type'].substring('#sap_mobile.'.length);
    const physicType = 'PhysicalInventoryDocItem';
    const purchaseReqType = 'PurchaseRequisitionItem';

    if (type === 'PurchaseOrderItem' || type === 'StockTransportOrderItem' || type === 'ReservationItem' || type === 'ProductionOrderComponent' || type === 'ProductionOrderItem') {
        return context.localizeText('item_item_number', [item.ItemNum]);
    } else if (type === 'InboundDeliveryItem' || type === 'OutboundDeliveryItem' || type === physicType) {
        return context.localizeText('item_item_number', [item.Item]);
    } else if (type === purchaseReqType) {
        return context.localizeText('item_item_number', [item.PurchaseReqItemNo]);
    } else if (type === 'MaterialDocItem') {
        return context.localizeText('material_document_item_number', [item.MatDocItem]);
    }
}
