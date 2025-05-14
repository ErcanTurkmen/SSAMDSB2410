import { ValueIfExists } from '../../../Common/Library/Formatter';

export default function TaggingType(context) {
    return ValueIfExists(context.binding.TaggingType);
}
