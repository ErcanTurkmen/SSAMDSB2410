import libCom from '../../Common/Library/CommonLibrary';

export default function GetOrder(context) {
    let data = libCom.getStateVariable(context, 'FixedData');
    let type;

    if (context.binding) {
        type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
        if (type === 'MaterialDocItem') {
            return context.binding.OrderNumber;
        } else if (type === 'ReservationItem' || type === 'ProductionOrderComponent') {
            return context.binding.OrderId;
        } else if (type === 'PurchaseOrderItem') {
            return context.binding.Order;
        }
    }
    if (data && data.order) return data.order;
    return '';
}
