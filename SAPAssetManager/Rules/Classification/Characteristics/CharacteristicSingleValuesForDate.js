/**
   * Get the characteristics values of the "DATE" data type but for "Single Value" type of Input.
   * Loop through all the characteristics and add it to the list picker after parsing them.
   *
   * @param {} context
   *
   * @returns {string} returns the sorted array of values with all the characteristic
   *
   */

import libCom from '../../Common/Library/CommonLibrary';
import dateDisplayValue from '../Characteristics/Date/CharacteristicsDateDisplayValue';
import dateReturnValue from '../Characteristics/Date/CharacteristicsDateReturnValue';
import sorter from '../Characteristics/CharacteristicSorter';
import assembleDisplayValues from './CharacteristicAssembleDisplayValue';
import assembleReturnValues from '../Characteristics/Date/CharacteristicAssembleReturnValueForDate';
import defaultCharacteristics from './CharacteristicsDefaultValues';
export default function CharacteristicSingleValuesForDate(context) {
    const controlNameFrom = libCom.getStateVariable(context, 'VisibleControlFrom');
    if (controlNameFrom !== 'DateSingleValue') {
        return [];
    }

    const classCharValues = defaultCharacteristics(context);
    const pickerItems = classCharValues.map(char => char2ListpickerItem(context, char));
    return pickerItems.sort(sorter);
}

function char2ListpickerItem(context, /** @type {ClassCharacteristicValue} */ char) {
    return {
        'DisplayValue': assembleDisplayValues(context, char.ValueRel, dateDisplayValue(context, char.CharValFrom), dateDisplayValue(context, char.CharValTo), 'SingleValues'),
        'ReturnValue': assembleReturnValues(context, char.ValueRel, parseInt(dateReturnValue(char.CharValFrom)), parseInt(dateReturnValue(char.CharValTo)), 'SingleValues'),
    };
}
