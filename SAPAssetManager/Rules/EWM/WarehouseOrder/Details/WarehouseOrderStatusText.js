import { WarehouseOrderStatus } from '../../Common/EWMLibrary';

export default function WarehouseOrderStatusText(context) {
    if (context.binding.WOStatus === WarehouseOrderStatus.Open || context.binding.WOStatus === WarehouseOrderStatus.InProgess) {
        return context.localizeText('open_ewm_items');
    } else if (context.binding.WOStatus === WarehouseOrderStatus.Confirmed) {
        return context.localizeText('confirmed_ewm_items');
    }
    return '';
}

