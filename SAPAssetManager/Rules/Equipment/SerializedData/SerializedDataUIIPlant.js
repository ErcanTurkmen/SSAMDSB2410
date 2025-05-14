import { ValueIfExists } from '../../Common/Library/Formatter';

export default function SerializedDataUIIPlant(context) {
    return ValueIfExists(context.binding.SerialNumber?.UIIPlant); 
}
