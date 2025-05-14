import libVal from '../Common/Library/ValidationLibrary';
import IsOnlineFunctionalLocation from './IsOnlineFunctionalLocation';

export default function FunctionalLocationStatus(context) {
    if (IsOnlineFunctionalLocation(context)) {
        if (context.binding.FuncLocSystemStatus?.length) {
            return context.binding.FuncLocSystemStatus[0].StatusText;
        } else {
            return '-';
        }
    }
    let flocation = context.binding;
    if (!libVal.evalIsEmpty(flocation.ObjectStatus_Nav.SystemStatus_Nav) && !libVal.evalIsEmpty(flocation.ObjectStatus_Nav.SystemStatus_Nav.StatusText)) {
        return flocation.ObjectStatus_Nav.SystemStatus_Nav.StatusText;
    } else {
        return '-';
    }
}
