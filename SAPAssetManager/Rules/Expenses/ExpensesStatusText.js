export default function ExpensesStatusText(context) {
    const orderId = context.binding.OrderID;
    const price = context.binding.ActualWork;
    
    return context.read('/SAPAssetManager/Services/AssetManager.service','MyWorkOrderHeaders', [], `$filter=OrderId eq '${orderId}'`).then(wos => {
        let currency = context.getGlobalDefinition('/SAPAssetManager/Globals/Expense/ExpenseDefaultCurrency.global').getValue();

        if (wos.getItem(0).OrderCurrency) {
            currency = wos.getItem(0).OrderCurrency;
        }

        return context.formatCurrency(price, currency, '', {'maximumFractionDigits': 1, 'useGrouping': true});
    });
}
