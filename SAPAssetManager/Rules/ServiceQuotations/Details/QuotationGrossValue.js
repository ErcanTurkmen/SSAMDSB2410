import LocalizationLibrary from '../../Common/Library/LocalizationLibrary';

export default function QuotationGrossValue(context) {
    return LocalizationLibrary.toCurrencyString(context, context.binding.GrossValue, context.binding.Currency, false, { 'maximumFractionDigits': 1, 'useGrouping': true });
}
