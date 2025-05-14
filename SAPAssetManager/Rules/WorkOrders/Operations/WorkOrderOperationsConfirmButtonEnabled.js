import libCommon from '../../Common/Library/CommonLibrary';

export default function WorkOrderOperationsConfirmButtonEnabled(context) {
    const selectedOperations = libCommon.getStateVariable(context, 'selectedOperations');
    return !!selectedOperations.length;
}
