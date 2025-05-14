import { ValueIfExists } from '../../Common/Library/Formatter';

export default function SerializedDataUniqueItemIdentifier(context) {
    return ValueIfExists(context.binding.SerialNumber?.UniqueItemIdentifier); 
}
