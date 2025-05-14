import libCom from '../../Common/Library/CommonLibrary';
import { ValueIfExists } from '../../Common/Library/Formatter';

export default function ServiceItemServiceProfileValue(context) {
    let binding = context.getBindingObject();
    if (libCom.isDefined(binding.ServiceProfile) && binding.ServiceProfile_Nav && libCom.isDefined(binding.ServiceProfile_Nav.Description)) {
        return `${binding.ServiceProfile} - ${binding.ServiceProfile_Nav.Description}`;
    }
    return ValueIfExists(binding.ServiceProfile);
}
