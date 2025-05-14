
export default function ItemsData(context) {
    /** @type {ItemDetailsBinding} */
    const binding = context.getPageProxy().binding;
    const itemsQuery = binding.ItemsQuery;
    return context.read('/SAPAssetManager/Services/AssetManager.service', itemsQuery.entitySet, [], itemsQuery.query).then(data => {
        const items = [];
        for (let i = 0; i < data.length; i++) {
            items[i] = data.getItem(i);
        }

        return items;
    });
}

/**
 * @typedef {PurchaseOrderItem | PurchaseRequisitionItem | StockTransportOrderItem | ReservationItem | ProductionOrderItem | ProductionOrderComponent | InboundDeliveryItem | OutboundDeliveryItem | MaterialDocItem | PhysicalInventoryDocItem } ItemType
 */


/**
 * @typedef ItemDetailsBinding
 * @prop {{entitySet: string, query: string}} ItemsQuery
 * @prop {ItemType} item
 */
