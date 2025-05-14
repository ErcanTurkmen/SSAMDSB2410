import { UOMCodeToValue, ValueIfExists } from '../../Common/Library/Formatter';
import IsServiceItemCategory from './IsServiceItemCategory';

export default function ServiceItemUnitValue(context) {
    let binding = context.getBindingObject();
    const isServiceProductItem = IsServiceItemCategory(context);
    if (isServiceProductItem) {
        return ValueIfExists(binding.DurationUOM, '-', UOMCodeToValue);
    } else {
        return ValueIfExists(binding.QuantityUOM, '-');
    }
}
