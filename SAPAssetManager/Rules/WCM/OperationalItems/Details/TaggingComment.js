import { ValueIfExists } from '../../../Common/Library/Formatter';

export default function TaggingComment(context) {
    return ValueIfExists(context.binding.TaggingComment);
}
