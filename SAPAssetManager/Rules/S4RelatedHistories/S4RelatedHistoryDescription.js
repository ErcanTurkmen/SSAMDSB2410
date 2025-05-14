import { ValueIfExists } from '../Common/Library/Formatter';

export default function S4RelatedHistoryDescription(context) {
    return ValueIfExists(context.binding.Description, '-');
}
