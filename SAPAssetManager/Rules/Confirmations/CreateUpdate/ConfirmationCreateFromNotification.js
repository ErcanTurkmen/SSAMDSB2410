import ConfirmationCreateUpdateNav from './ConfirmationCreateUpdateNav';
import ODataDate from '../../Common/Date/ODataDate';

export default function ConfirmationCreateFromNotification(context) {

    let binding = context.getBindingObject();
    let currentDate = new Date();
    let odataDate = new ODataDate(currentDate);

    let override = {
        'OrderID': '',
    };

    if (binding.OrderId) {
        override.OrderID = binding.OrderId;
    }

    return ConfirmationCreateUpdateNav(context, override, odataDate.date(), odataDate.date());
}
