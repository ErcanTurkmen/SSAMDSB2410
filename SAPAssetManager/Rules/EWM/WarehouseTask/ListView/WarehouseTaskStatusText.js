import { WarehouseTaskStatus } from '../../Common/EWMLibrary';

export default function WarehouseTaskStatusText(clientAPI) {
    if (clientAPI.binding.WTStatus === WarehouseTaskStatus.Open || clientAPI.binding.WTStatus === WarehouseTaskStatus.Waiting) {
        return clientAPI.localizeText('open_ewm_items');
    }
    if (clientAPI.binding.WTStatus === WarehouseTaskStatus.Confirmed) {
        return clientAPI.localizeText('confirmed_ewm_items');
    }
    return '';
}
