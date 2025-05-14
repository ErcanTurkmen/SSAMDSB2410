import libCommon from '../../Common/Library/CommonLibrary';

export default function ExpenseCreateUpdateOnPageUnloaded(context) {
    if (libCommon.getStateVariable(context, 'ExpenseScreenReopened')) {
        libCommon.removeStateVariable(context, 'ExpenseScreenReopened', false);
    }
}
