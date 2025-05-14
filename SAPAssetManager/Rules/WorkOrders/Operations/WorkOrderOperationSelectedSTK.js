import ValidationLibrary from '../../Common/Library/ValidationLibrary';

export default function WorkOrderOperationSelectedSTK(context) {
    const stkPicker = context.getControl('FormCellContainer').getControl('StandardTextKeyListPicker');
    return !ValidationLibrary.evalIsEmpty(stkPicker.getValue()) && stkPicker.getValue()[0].ReturnValue || '';
}
