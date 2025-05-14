import libCommon from '../../Common/Library/CommonLibrary';
import IsCompleteAction from '../../WorkOrders/Complete/IsCompleteAction';

export default function IsCancelExpenseButtonVisible(context) {
    if (IsCompleteAction(context)) {
        return false;
    }

    return !!libCommon.getStateVariable(context, 'ExpenseScreenReopened');
}
