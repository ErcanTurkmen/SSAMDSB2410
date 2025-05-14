export default function GetUOM(context) {
    if (!(context.binding)) {
        return '';
    }
    if (context.binding) {
        const binding = context.binding;
        const type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
        if (type === 'PurchaseOrderItem' || type === 'ProductionOrderItem' || type === 'StockTransportOrderItem') {
            return binding.OrderUOM;
        } else if (type === 'MaterialDocItem') {
            return binding.EntryUOM;
        } else if (type === 'ProductionOrderComponent' || type === 'ReservationItem') {
            return binding.RequirementUOM;
        } else if (type === 'InboundDeliveryItem' || type === 'OutboundDeliveryItem') {
            return binding.UOM;
        }
    }
    return '';

}
