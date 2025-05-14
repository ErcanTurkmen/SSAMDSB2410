import localLib from '../../Common/Library/LocalizationLibrary';

export default function ServiceItemAmountValue(context) {
    const binding = context.getBindingObject();
    return localLib.toCurrencyString(context, binding.Amount, binding.Currency, false);
}
