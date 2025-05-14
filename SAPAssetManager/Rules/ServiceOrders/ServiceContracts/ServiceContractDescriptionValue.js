import { ValueIfExists } from '../../Common/Library/Formatter';

export default function ServiceContractDescriptionValue(context) {
    return ValueIfExists(context.binding.Description, '-');
}
