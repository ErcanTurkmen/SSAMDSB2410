import { ValueIfExists } from '../../Common/Library/Formatter';

export default function ServiceItemDurationValue(context) {
    let binding = context.getBindingObject();
    return ValueIfExists(binding.Duration);
}
