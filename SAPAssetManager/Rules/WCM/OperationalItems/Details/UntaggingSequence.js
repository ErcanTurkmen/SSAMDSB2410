import { ValueIfExists } from '../../../Common/Library/Formatter';

export default function UntaggingSequence(context) {
    return ValueIfExists(context.binding.UntSequence,'-',function(value) {
        return context.formatNumber(Number(value));
    });
}
