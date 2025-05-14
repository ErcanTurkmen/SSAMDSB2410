import { ValueIfExists } from '../../../Common/Library/Formatter';

export default function Tag(context) {
    return ValueIfExists(context.binding.Tag);
}
