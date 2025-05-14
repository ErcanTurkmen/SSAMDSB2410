import { ValueIfExists } from '../../../Common/Library/Formatter';

export default function UntaggingType(context) {
    return ValueIfExists(context.binding.UntaggingType);
}
