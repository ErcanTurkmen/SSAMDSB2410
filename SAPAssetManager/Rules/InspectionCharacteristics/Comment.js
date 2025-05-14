import { ValueIfExists } from '../Common/Library/Formatter';

export default function Comment(context) {
    return ValueIfExists(context.binding.Remarks);
}
