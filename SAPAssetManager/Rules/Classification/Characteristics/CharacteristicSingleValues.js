/**
   * Get the characteristics values of any data type but for "Single Value" type of Input.
   * Loop through all the characteristics and add it to the list picker
   *
   * @param {} context
   *
   * @returns {string} returns the sorted array of values with all the characteristic
   *
   */
import libCom from '../../Common/Library/CommonLibrary';
import CharacteristicSorter from '../Characteristics/CharacteristicSorter';
import CharacteristicCharacterDescription from '../Characteristics/Character/CharacteristicCharacterDescription';
import CharacteristicAssembleDisplayValue from './CharacteristicAssembleDisplayValue';
import CharacteristicAssembleReturnValue from './CharacteristicAssembleReturnValue';
import CharacteristicsDefaultValues from './CharacteristicsDefaultValues';

export default function CharacteristicSingleValues(context) {
    const controlNameFrom = libCom.getStateVariable(context, 'VisibleControlFrom');
    const classCharValues = CharacteristicsDefaultValues(context);
    const numberOfDecimals = context.binding.Characteristic.NumofDecimal;
    const pickerItems = classCharValues.map(charVal => ['CharacterSingleValue', 'CharacterMultipleValue', 'CharacterFreeForm'].includes(controlNameFrom) ? charVal2SimplePickerItem(charVal) : charVal2ComplicatedPickerItem(context, charVal, numberOfDecimals));

    return pickerItems.sort(CharacteristicSorter);
}

function charVal2SimplePickerItem(charVal) {
    return {
        'DisplayValue': `${CharacteristicCharacterDescription(charVal)}`,
        'ReturnValue': charVal.CharValue,
    };
}

function charVal2ComplicatedPickerItem(context, charVal, numberOfDecimals) {
    return {
        'DisplayValue': CharacteristicAssembleDisplayValue(context, charVal.ValueRel, context.formatNumber(charVal.CharValFrom, '', { maximumFractionDigits: numberOfDecimals, minimumFractionDigits: 0 }), context.formatNumber(charVal.CharValTo, '', { maximumFractionDigits: numberOfDecimals, minimumFractionDigits: 0 }), 'SingleValues'),
        'ReturnValue': CharacteristicAssembleReturnValue(context, charVal.ValueRel, charVal.CharValFrom.toString(), charVal.CharValTo.toString(), 'SingleValues'),
    };
}
