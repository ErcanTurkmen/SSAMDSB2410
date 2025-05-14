import ExpenseVisible from './ExpensesVisible';
import isWindows from '../../Common/IsWindows';
export default function FSMExpensesSectionVisible(context) {
    return ExpenseVisible(context) & isWindows(context);
}
