
export default function ContainerItemsQuantity(clientAPI) {
    return formatQuantityAndUnit(clientAPI.binding.RetblQtyInOrderUnit, clientAPI.binding.RetblQtyOrderUnit);
}

function formatQuantityAndUnit(quantity, unit) {
    const num = parseFloat(quantity);
    return `${num} ${unit}`;
}
