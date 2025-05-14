import LocalizationLibrary from '../../Common/Library/LocalizationLibrary';

export default function QuotationNetValueWithoutFreight(context) {
    return LocalizationLibrary.toCurrencyString(context, context.binding.Netwoutfreight, context.binding.Currency, false, { 'maximumFractionDigits': 1, 'useGrouping': true });
}
