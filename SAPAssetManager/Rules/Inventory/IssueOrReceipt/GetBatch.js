export default function GetBatch(context, bindingObject) {

    const binding = getBindingValue(context, bindingObject);
    // method is called from different places and sends one or 2 or nothing as the input parameters
    // we assume additinal bindingObject was provided
    // if bindingobject not defined, then check context.binding, if defined, then check for item, if item defined,
    // then use context.binding.item, otherwise use context.binding

    if (binding) {
        const type = binding['@odata.type'].substring('#sap_mobile.'.length);
        if (type === 'MaterialDocItem' || type === 'ReservationItem' || type === 'OutboundDeliveryItem' || type === 'InboundDeliveryItem' || type === 'ProductionOrderComponent' || type === 'ProductionOrderItem') {
            return binding.Batch;
        } else if (type === 'PurchaseOrderItem') {
            if (binding.ScheduleLine_Nav && binding.ScheduleLine_Nav.length > 0) {
                return binding.ScheduleLine_Nav[0].Batch;
            }
        } else if (type === 'StockTransportOrderItem') {
            if (binding.STOScheduleLine_Nav && binding.STOScheduleLine_Nav.length > 0) {
                return binding.STOScheduleLine_Nav[0].Batch;
            }
        }
    }
    return ''; //If not editing an existing local receipt item and no item default, then set to empty
}

function getBindingValue(context, bindingObject) {
    return bindingObject || (context.binding && context.binding.item) || context.binding;
}
