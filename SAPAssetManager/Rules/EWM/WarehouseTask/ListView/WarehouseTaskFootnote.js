
export default function WarehouseTaskFootnote(clientAPI) {
    if (clientAPI.binding.SourceHU && clientAPI.binding.DestinationHU) {
        return clientAPI.localizeText('warehouse_task_hu_x_x', [clientAPI.binding.SourceHU, clientAPI.binding.DestinationHU]);
    } 
    const handlingUnit = clientAPI.binding.SourceHU ?? clientAPI.binding.DestinationHU;
    if (handlingUnit) {
        return clientAPI.localizeText('warehouse_task_hu_x', [handlingUnit]);
    }
    return '';
}
