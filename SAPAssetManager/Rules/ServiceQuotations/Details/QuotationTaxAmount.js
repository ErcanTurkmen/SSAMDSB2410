import LocalizationLibrary from '../../Common/Library/LocalizationLibrary';

export default function QuotationTaxAmount(context) {
    return LocalizationLibrary.toCurrencyString(context, context.binding.TaxAmount, context.binding.Currency, false, { 'maximumFractionDigits': 1, 'useGrouping': true });
}
