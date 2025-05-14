
export default function WarehouseOrderSubStatusText(context) {
    const taskCount = (context.binding.WarehouseTask_Nav && context.binding.WarehouseTask_Nav.length) || 0;
    return context.localizeText('x_wo_tasks', [taskCount]);
}
