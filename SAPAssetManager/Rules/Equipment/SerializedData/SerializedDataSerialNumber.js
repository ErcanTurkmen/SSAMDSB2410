import { ValueIfExists } from '../../Common/Library/Formatter';

export default function SerializedDataSerialNumber(context) {
    return ValueIfExists(context.binding.SerialNumber?.SerialNumber); 
}
