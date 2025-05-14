import { ValueIfExists } from '../../Common/Library/Formatter';

export default function ServiceContractStatusDescValue(context) {
    return ValueIfExists(context.binding.StatusDesc, '-');
}
