import { ValueIfExists } from '../../Common/Library/Formatter';

export default function SerializedDataIUIDType(context) {
    return ValueIfExists(context.binding.SerialNumber?.IUIDType); 
}
