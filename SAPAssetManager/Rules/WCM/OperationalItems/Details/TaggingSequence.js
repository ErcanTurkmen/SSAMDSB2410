import { ValueIfExists } from '../../../Common/Library/Formatter';

export default function TaggingSequence(context) {
    return ValueIfExists(context.binding.TagSequence,'-',function(value) {
        return context.formatNumber(Number(value));
    });
}
