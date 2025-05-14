import { ValueIfExists } from '../../../Common/Library/Formatter';

export default async function OperationalItemsTagNumber(context) {
    return `${context.localizeText('tag_number_x', [ValueIfExists(context.binding.Tag)])}`;
}
