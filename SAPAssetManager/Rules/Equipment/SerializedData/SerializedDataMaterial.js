import { ValueIfExists } from '../../Common/Library/Formatter';

export default function SerializedDataMaterial(context) {
    return ValueIfExists(context.binding.SerialNumber?.MaterialNum); 
}
