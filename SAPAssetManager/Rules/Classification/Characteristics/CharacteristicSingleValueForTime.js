/**
   * Get the characteristics values of the "TIME" data type but for "Single Value" type of Input.
   * Loop through all the characteristics and add it to the list picker after parsing them.
   *
   * @param {} context
   *
   * @returns {string} returns the sorted array of values with all the characteristic
   *
   */
import libCom from '../../Common/Library/CommonLibrary';
import timeDisplayValue from '../Characteristics/Time/CharacteristicsTimeDisplayValue';
import defaultCharacteristics from './CharacteristicsDefaultValues';
import CharacteristicAssembleDisplayValue from './CharacteristicAssembleDisplayValue';
import CharacteristicAssembleReturnValue from './CharacteristicAssembleReturnValue';
import CharacteristicSorter from './CharacteristicSorter';


export default function CharacteristicSingleValueForTime(context) {
    const controlNameFrom = libCom.getStateVariable(context, 'VisibleControlFrom');
    if (controlNameFrom !== 'TimeSingleValue') {
        return [];
    }
    const classCharValues = defaultCharacteristics(context) || [];
    const pickerItems = classCharValues.map((/** @type {ClassCharacteristicValue} */ char) => char2ListpickerItem(context, char));

    return pickerItems.sort(CharacteristicSorter);
}

function char2ListpickerItem(context, /** @type {ClassCharacteristicValue} */ char) {
    return {
        'DisplayValue': CharacteristicAssembleDisplayValue(context, char.ValueRel, timeDisplayValue(context, char.CharValFrom), timeDisplayValue(context, char.CharValTo), 'SingleValues'),
        'ReturnValue': CharacteristicAssembleReturnValue(context, char.ValueRel, parseInt(char.CharValFrom), parseInt(char.CharValTo), 'SingleValues'),
    };
}
