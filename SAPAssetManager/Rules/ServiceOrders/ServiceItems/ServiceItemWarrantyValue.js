import { ValueIfExists } from '../../Common/Library/Formatter';

export default function ServiceItemWarrantyValue(context) {
    let binding = context.getBindingObject();
    return ValueIfExists(binding.WarrantyDesc);
}
