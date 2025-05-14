import errorVal from '../Common/Library/ErrorLibrary';
import libVal from '../Common/Library/ValidationLibrary';

export default function IsSyncErrorsExists(context) {
    return !libVal.evalIsEmpty(errorVal.getErrorMessage(context));
}
