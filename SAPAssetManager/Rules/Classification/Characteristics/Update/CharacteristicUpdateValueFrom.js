/**
 * Get the CharValFrom value from the appropriate control.
 * 
 * @param {} context
 * 
 * @returns {string} returns the appropriate value.
 * 
 */
import libCom from '../../../Common/Library/CommonLibrary';
import libVal from '../../../Common/Library/ValidationLibrary';
import formattedDateTime from '../Date/CharacteristicFormattedDateTime';
import deAssembleReturnValues from '../CharacteristicDeAssembleReturnValue';

export default function CharacteristicUpdateValueFrom(context) {
    let controlName = libCom.getStateVariable(context,'VisibleControlFrom');
    let charValFrom = libVal.evalIsEmpty(context.binding.CharValFrom) ? '0' : context.binding.CharValFrom.toString();

    if (controlName !== 'CharacterSingleValue' && controlName !== 'CharacterMultipleValue' && controlName !== 'CharacterFreeForm') {
        let isListPicker = libCom.getStateVariable(context,'ListPicker');
        let isMultiListPicker = libCom.getStateVariable(context,'MultiListPicker');
        let multiPickerIndex = libCom.getStateVariable(context,'ListPickerLoopIndex');
        let control = libCom.getControlProxy(context, controlName);
        let dataType = context.binding.Characteristic.DataType;
        
        if (isListPicker) {
            return deAssembleReturnValues(control.getValue()[0].ReturnValue, 'CharValFrom');
        } else if (isMultiListPicker) {
            return deAssembleReturnValues(control.getValue()[multiPickerIndex-1].ReturnValue, 'CharValFrom');
        }

        let valueCode = ['6','7'];
        if (!valueCode.includes(context.binding.ValueRel)) {
            return handleNonPickerControls(context, control, multiPickerIndex, dataType, charValFrom);
        } 
        return charValFrom;
    }
    return charValFrom;
}

function getReturnValue(control, context, multiPickerIndex) {
    let result;
    if (control.getValue().length === 0) {
        result = context.binding.CharValFrom.toString();
    } else if (control.getValue().length > 1 ) {
        result = control.getValue()[multiPickerIndex-1].ReturnValue;
    } else {
        result = control.getValue()[0].ReturnValue;
    }
    return result;
}

function handleNonPickerControls(context, control, multiPickerIndex, dataType, charValFrom) {
    switch (control.getType()) {
        case 'Control.Type.FormCell.ListPicker':
            return getReturnValue(control, context, multiPickerIndex);
        case 'Control.Type.FormCell.SimpleProperty': {
            let value = libVal.evalIsEmpty(control.getValue()) ? control.binding.CharValFrom.toString() : control.getValue().toString();
            if (dataType === 'NUM' || dataType === 'CURR') {
                if (value.includes(',')) {
                    value = value.replace(',', '.');
                }
            }
            return Number(value);
        }
        case 'Control.Type.FormCell.DatePicker':
            return parseFloat(formattedDateTime(context, control.getValue()));
        default:
            return charValFrom;
    }
}
