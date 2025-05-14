import libEval from '../../Common/Library/ValidationLibrary';
import libCommon from '../../Common/Library/CommonLibrary';

export default function NotificationReferenceNumber(context) {
    if (libCommon.getStateVariable(context, 'isFollowOn')) {
        return libEval.evalIsEmpty(context.binding.OrderId) ? '' : context.binding.OrderId;
    } else {
        return '';
    }
}
