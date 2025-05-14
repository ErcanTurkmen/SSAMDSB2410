import LocalizationLibrary from '../../Common/Library/LocalizationLibrary';

export default function QuotationNetValue(context) {
    return LocalizationLibrary.toCurrencyString(context, context.binding.NetValue, context.binding.Currency, false, { 'maximumFractionDigits': 1, 'useGrouping': true });
}
