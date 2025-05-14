import valueRelSign from '../CharacteristicsValueRelToSign';
import valueSignToRel from '../CharacteristicsSignToValueRel';
import dateReturnValue from '../../Characteristics/Date/CharacteristicsDateReturnValue';
import charValue from '../CharacteristicValueFrom';
import libVal from '../../../Common/Library/ValidationLibrary';

export default function CharacteristicAssembleReturnValueForDate(context, valueRel = '', valueFrom = '', valueTo = '', dataType = '') {
    const valueSigns = valueRelSign(valueRel === '' ? context.binding.ValueRel : valueRel);
    const valueRelation = valueSignToRel(valueSigns);
    const valueCode = ['2', '3', '4', '5'];

    // The values are empty, meaning the data source is Object Level
    // In Object level, we get dummy values i.e. 1e+17 or -1e+17 but 
    // on Class level we get 0 and no dummy values. So we need to change
    // Object level to class level to be consistent.
    if (valueFrom === '' || valueTo === '' && dataType === '') {
        valueFrom = getValueFrom(context);
        valueTo = getValueTo(context, valueCode);
    }
    // In Objecet level, If relation ship type is 6 or 7, we get value from ValTo
    // but in Class level, we always get values from ValFrom
    if (['6', '7'].includes(valueRelation) && ['SingleValues', 'MultipleValues'].includes(dataType)) {
        [valueFrom, valueTo] = [valueTo, valueFrom];
    }

    const baseValue = `${valueSigns[0]}|${valueFrom}|`;
    // There are more than one sign to show
    return valueSigns.length > 1 ? `${baseValue}${valueSigns[1]}|${valueTo}` : `${baseValue}${valueTo}`;
}

/**
 * Check if value is empty or extreme
 * @param {String} value
 */
function isEmptyOrExtreme(value) {
    const extremeValue = '1e+17';
    return libVal.evalIsEmpty(value) || [extremeValue, `-${extremeValue}`].includes(value.toExponential());
}

/**
 * Get value from
 * @param {Context} context - calling context
 */
function getValueFrom(context) {
    return isEmptyOrExtreme(context.binding.CharValFrom) ? '0' : dateReturnValue(charValue(context));
}

/**
 * Get value to
 * @param {Context} context - calling context
 * @param {Number[]} valueCode
 */
function getValueTo(context, valueCode) {
    const { CharValTo, ValueRel } = context.binding;
    const defaultValue = '0';

    if (isEmptyOrExtreme(CharValTo)) {
        return defaultValue;
    }

    if (valueCode.includes(ValueRel)) {
        return dateReturnValue(CharValTo.toString());
    }

    return defaultValue;
}
