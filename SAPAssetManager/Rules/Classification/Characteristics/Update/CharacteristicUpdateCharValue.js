import libCom from '../../../Common/Library/CommonLibrary';
import charValue from  '../Character/CharacteristicsCharacterValue';
/**
   * Get the characteristics value of only "CHAR" types
   * 
   * @param {} context
   * 
   * @returns {string} the modified value of the characterisitcs, if empty, return the same value.
   * 
   */
export default function CharacteristicUpdateCharValue(context) {
    const controlName = libCom.getStateVariable(context,'VisibleControlFrom');
    const control = libCom.getControlProxy(context, controlName);
    const multiPickerIndex = libCom.getStateVariable(context,'ListPickerLoopIndex');

    if (['CharacterSingleValue', 'CharacterMultipleValue', 'CharacterFreeForm'].includes(controlName)) {
        switch (control.getType()) {
            case 'Control.Type.FormCell.ListPicker': 
                return handleListPicker(context, control, multiPickerIndex);
            case 'Control.Type.FormCell.SimpleProperty':
                return control.getValue();
            default:
                return context.binding.CharValue;
        }
    }
    return charValue(context);
}

function handleListPicker(context, control, multiPickerIndex) {
    const controlValue = control.getValue();

    if (!controlValue.length) {
        return context.binding.CharValue;
    } else if (controlValue.length > 1) {
        return controlValue[multiPickerIndex-1].ReturnValue;
    } else {
        return controlValue[0].ReturnValue;
    }
}
