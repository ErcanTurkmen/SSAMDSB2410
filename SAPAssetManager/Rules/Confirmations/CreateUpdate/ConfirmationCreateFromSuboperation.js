
import ConfirmationCreateUpdateNav from './ConfirmationCreateUpdateNav';
import ODataDate from '../../Common/Date/ODataDate';

/** @param {{binding: MyWorkOrderSubOperation} & IClientAPI} context  */
export default function ConfirmationCreateFromSuboperation(context) {
    const subOperation = context.binding;
    const currentDate = new Date();
    let odataDate = new ODataDate(currentDate);

    if (subOperation.PostingDate) {
        odataDate = new ODataDate(subOperation.PostingDate);
        odataDate._date.setHours(currentDate.getHours());
        odataDate._date.setMinutes(currentDate.getMinutes());
        odataDate._date.setSeconds(0);
    }

    const override = {
        'PostingDate': odataDate,
        'SubOperation': subOperation.SubOperationNo,
        'Operation': subOperation.OperationNo,
        'OrderID': subOperation.OrderId,
        'IsWorkOrderChangable': false,
        'IsOperationChangable': false,
        'IsSubOperationChangable': false,
    };

    return ConfirmationCreateUpdateNav(context, override, odataDate.date(), odataDate.date());
}
