export default function WarehouseOrderBodyText(context) {
    const binding = context.binding;
    return [binding.WOProcessType, binding.Resource].filter(i => !!i).join(', ');
}
