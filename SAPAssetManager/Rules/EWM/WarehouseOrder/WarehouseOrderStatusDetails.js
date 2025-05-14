export default function WarehouseOrderStatusDetails(context) {

let status = context.binding.WOStatus;
if (status === '' || status === 'D') {
    return context.localizeText('open_ewm_items');
} else if (status === 'C') {
    return context.localizeText('confirmed_ewm_items');
} else {
    return status;
}
}

