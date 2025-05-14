import libCommon from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';
import IsRefObjectPickerEditable from './IsRefObjectPickerEditable';

export default function ServiceOrderCreateUpdateHierarchyListPickerOnLoaded(control) {
    if (libVal.evalIsEmpty(control.getPageProxy().binding)) {
        control.getPageProxy()._context.binding = control.binding;
    }

    let name = control.getName();
    let context = control.getPageProxy();
    let formCellContainer = context.getControl('FormCellContainer');
    let extension;
    let value;

    const controlFromFormCell = formCellContainer.getControl(name);
    const isOnEdit = !libCommon.IsOnCreate(context);
    const binding = context.binding;
    const refObj = binding.RefObj_Nav && binding.RefObj_Nav[0];

    //Flag setEmptyValue is used for reset value 
    //If setEmptyValue true, reset flag and keep control value empty
    if (controlFromFormCell.getClientData().setEmptyValue) {
        controlFromFormCell.getClientData().setEmptyValue = false;

        return;
    }

    if (name === 'FuncLocHierarchyExtensionControl') {
        value = controlFromFormCell.getValue();
        if (!value) {
            value = binding.HeaderFunctionLocation || (refObj && refObj.FLocID);
        }
        extension = controlFromFormCell.getExtension();
    } else {
        value = controlFromFormCell.getValue();
        if (!value) {
            value = binding.HeaderEquipment || (refObj && refObj.EquipID);
        }
        extension = controlFromFormCell.getExtension();
    }
    if (extension) {
        extension.setData(value);
    }
    const isEdit = checkIsEdit(isOnEdit, control);
    if (isEdit) {
        const isEditable = IsRefObjectPickerEditable(control);
        extension.setEditable(isEditable);
    }
}

function checkIsEdit(isOnEdit, control) {
    return isOnEdit || control.binding.ObjectID;
}
