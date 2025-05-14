import GetReceivedQuantity from './GetReceivedQuantity';

export default function GetReceivedQuantityDefaultValue(context) {
    const quantity = GetReceivedQuantity(context);
    return quantity ? quantity.toString() : '';
}
