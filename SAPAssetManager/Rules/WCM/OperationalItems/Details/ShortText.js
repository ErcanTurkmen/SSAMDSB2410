import { ValueIfExists } from '../../../Common/Library/Formatter';

export default function ShortText(context) {
    return ValueIfExists(context.binding.ShortText);
}
