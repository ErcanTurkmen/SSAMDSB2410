import libCom from '../../Common/Library/CommonLibrary';
import {ValueIfExists} from '../../Common/Library/Formatter';

export default function GetDeliveryDate(context) {
    const binding = context.binding;
    const type = binding['@odata.type'].substring('#sap_mobile.'.length);
    let date = '';

    if (type === 'PurchaseOrderItem') {
        date =  binding?.ScheduleLine_Nav[0] && binding.ScheduleLine_Nav[0]?.DeliveryDate;
    } else if (type === 'StockTransportOrderItem') {
        date = binding?.STOScheduleLine_Nav[0] && binding.STOScheduleLine_Nav[0]?.DeliveryDate;
    } else {
        date = binding?.DeliveryDate;
    }
    if (date) {
        const dateString = libCom.dateStringToUTCDatetime(date);
        const dateText = libCom.getFormattedDate(dateString, context);
        return dateText;
    } else {
        return ValueIfExists(date);
    }
}
