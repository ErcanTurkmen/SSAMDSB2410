import { ValueIfExists } from '../../../Common/Library/Formatter';

export default function UntaggingComment(context) {
    return ValueIfExists(context.binding.UntagComment);
}
