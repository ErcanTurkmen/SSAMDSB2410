import localLib from '../../Common/Library/LocalizationLibrary';

export default function ServiceItemNetValue(context) {
    const binding = context.getBindingObject();
    return localLib.toCurrencyString(context, binding.NetValue, binding.Currency, false);
}

