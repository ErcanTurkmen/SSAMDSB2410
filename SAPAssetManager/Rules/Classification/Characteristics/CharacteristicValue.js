
/**
 * Assemble Characteristics with theri respective Unit of Measure to
 * display on the list view.
 */
import assembleDisplayValues from './CharacteristicAssembleDisplayValue';
import dateDisplayValue from './Date/CharacteristicsDateDisplayValue';
import timeDisplayValue from './Time/CharacteristicsTimeDisplayValue';
import charValue from './Character/CharacteristicCharacterDescription';

export default function CharacteristicValue(context, characteristic, withUOM = true) {
    const { 
        DataType: dataType, 
        SingleValue: singleValue, 
        NumofDecimal: numberOfDecimals ,
    } = characteristic.Characteristic;
    const isSingleValue = singleValue === 'X';
    const valuesType = isSingleValue ? 'SingleValues' : 'MultipleValues';

    switch (dataType) {
        case 'NUM':
        case 'CURR':
            return assembleDisplayValues(
                context, 
                characteristic.ValueRel, 
                context.formatNumber(characteristic.CharValFrom, '', { maximumFractionDigits: numberOfDecimals, minimumFractionDigits: 0 }), 
                context.formatNumber(characteristic.CharValTo, '', { maximumFractionDigits: numberOfDecimals, minimumFractionDigits: 0 }), 
                valuesType, 
                withUOM,
            );    
        case 'DATE':
            return assembleDisplayValues(
                context, 
                characteristic.ValueRel, 
                dateDisplayValue(context, characteristic.CharValFrom), 
                dateDisplayValue(context, characteristic.CharValTo), 
                valuesType, 
                withUOM,
            );
        case 'TIME':
            return assembleDisplayValues(
                context, 
                characteristic.ValueRel, 
                timeDisplayValue(context, characteristic.CharValFrom), 
                isSingleValue ? '0' : timeDisplayValue(context, characteristic.CharValTo),
                valuesType, 
                withUOM,
            );
        default:
            return charValue(characteristic);
    }
}
