import libCom from '../../Common/Library/CommonLibrary';
import { ValueIfExists } from '../../Common/Library/Formatter';

export default function ServiceItemServiceTypeValue(context) {
    let binding = context.getBindingObject();
    if (libCom.isDefined(binding.ServiceType) && binding.ServiceType_Nav && libCom.isDefined(binding.ServiceType_Nav.Description)) {
        return `${binding.ServiceType} - ${binding.ServiceType_Nav.Description}`;
    }
    return ValueIfExists(binding.ServiceType);
}
