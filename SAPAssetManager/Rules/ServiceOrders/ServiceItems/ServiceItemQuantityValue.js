import { ValueIfExists } from '../../Common/Library/Formatter';

export default function ServiceItemQuantityValue(context) {
    let binding = context.getBindingObject();
    return String(ValueIfExists(binding.Quantity));
}
