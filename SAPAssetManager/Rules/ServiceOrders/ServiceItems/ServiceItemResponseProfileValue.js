import { ValueIfExists } from '../../Common/Library/Formatter';

export default function ServiceItemResponseProfileValue(context) {
    let binding = context.getBindingObject();
    return ValueIfExists(binding.ResponseProfile);
}
