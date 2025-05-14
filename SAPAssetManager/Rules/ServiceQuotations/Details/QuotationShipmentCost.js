import LocalizationLibrary from '../../Common/Library/LocalizationLibrary';

export default function QuotationShipmentCost(context) {
    return LocalizationLibrary.toCurrencyString(context, context.binding.ShipmentCosts, context.binding.Currency, false, { 'maximumFractionDigits': 1, 'useGrouping': true });
}
