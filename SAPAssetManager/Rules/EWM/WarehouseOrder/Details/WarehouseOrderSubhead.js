export default function WarehouseOrderSubhead(context) {
    const binding = context.binding;
    return [binding.Queue, binding.ActivityArea].filter(i => !!i).join(', ');
}
