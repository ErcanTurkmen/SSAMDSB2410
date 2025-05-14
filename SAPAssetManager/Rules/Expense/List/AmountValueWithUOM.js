
export default function AmountValueWithUOM(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', `MyWorkOrderHeaders('${context.binding.OrderID}')`, [], '').then(result => {
        let currency = context.getGlobalDefinition('/SAPAssetManager/Globals/Expense/ExpenseDefaultCurrency.global').getValue();

        if (result && result.length && result.getItem(0).OrderCurrency) {
            currency = result.getItem(0).OrderCurrency;
        }
      
        return context.formatCurrency(context.binding.ActualWork, currency, '', {'maximumFractionDigits': 1, 'useGrouping': true});
    });
}
