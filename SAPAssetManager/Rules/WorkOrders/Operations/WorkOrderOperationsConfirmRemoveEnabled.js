import libCommon from '../../Common/Library/CommonLibrary';

export default function WorkOrderOperationsConfirmRemoveEnabled(context) {
    const selectedItems = libCommon.getStateVariable(context, 'selectedOperationConfirmations');
    return !!selectedItems && !!selectedItems.length;
}
