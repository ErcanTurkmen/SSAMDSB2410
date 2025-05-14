export default function WarehouseOrderStatusDetails(context) {
    if (context.binding.WarehouseTask_Nav) {
        return context.binding.WarehouseTask_Nav.length + ' ' + context.localizeText('warehouse_tasks');
    } else {
        return 0 + ' ' + context.localizeText('warehouse_tasks');
    }
}
