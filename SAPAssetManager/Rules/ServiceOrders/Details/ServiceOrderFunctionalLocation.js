import libCom from '../../Common/Library/CommonLibrary';
import {ValueIfExists} from '../../Common/Library/Formatter';

export default function ServiceOrderFunctionalLocation(context) {
    if (libCom.isDefined(context.binding.MyFunctionalLocation_Nav)) {
        return ValueIfExists(context.binding.MyFunctionalLocation_Nav.FuncLocDesc);
    }
    if (libCom.isDefined(context.binding.FuncLoc_Nav)) {
        return ValueIfExists(context.binding.FuncLoc_Nav.FuncLocDesc);
    }

    return ValueIfExists('');
}
