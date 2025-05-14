
import MobileStatusLibrary from '../../MobileStatus/MobileStatusLibrary';

export default function OperationPickerQueryOptions(context, orderIdParam) {

    let orderTemp;
    let binding = context.getBindingObject();

    orderTemp = binding ? binding.OrderID : '';

    if (orderIdParam) {
        orderTemp = orderIdParam;
    }

    return MobileStatusLibrary.getQueryOptionsForCompletedStatusForOperations(context, orderTemp);
}
