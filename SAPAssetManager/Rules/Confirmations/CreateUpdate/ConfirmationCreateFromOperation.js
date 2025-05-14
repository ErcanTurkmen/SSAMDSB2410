
import ConfirmationCreateUpdateNav from './ConfirmationCreateUpdateNav';
import ODataDate from '../../Common/Date/ODataDate';

// Sets default order, operation and current datetime to binding before navigation to confirmation creation
export default function ConfirmationCreateFromOperation(context) {
    let currentDate = new Date();
    let hours = currentDate.getHours();
    let minutes = currentDate.getMinutes();
    if (hours < 10) hours = `0${hours}`;
    if (minutes < 10) minutes = `0${minutes}`;
    let timeStr = `${hours}:${minutes}:00`;
    let binding = context.getBindingObject();
    let postingDate;
    let odataDate = new ODataDate(currentDate);

    if (binding) {
        postingDate = context.getBindingObject().PostingDate;
    }
    if (postingDate) {
        odataDate = new ODataDate(postingDate, timeStr);
    }

    binding = context.binding;
    let actionBinding;
    if (context.getPageProxy() && context.getPageProxy().getActionBinding()) {
        actionBinding = context.getPageProxy().getActionBinding();
    }
    if (!binding || (actionBinding && binding.OrderId !== actionBinding.OrderId)) {
        binding = actionBinding;
    }
    let override = {
        'PostingDate': odataDate,
        'Operation': binding.OperationNo,
        'OrderID': binding.OrderId,
        'IsWorkOrderChangable': false,
        'IsOperationChangable': false,
    };

    return ConfirmationCreateUpdateNav(context, override, odataDate.date(), odataDate.date());
}
