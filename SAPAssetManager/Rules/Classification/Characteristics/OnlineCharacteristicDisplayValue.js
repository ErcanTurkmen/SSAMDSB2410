import charValue from './CharacteristicValue';
import prettyPrint from './ClassificationCharacteristicsPrettyPrint';
import OnlineGetCharacteristicValues from './OnlineGetCharacteristicValues';
/**
 *
 * @param {*} context
 * @param {*} withUOM Display UOM value?
 * @returns
 */
export default function OnlineCharacteristicDisplayValue(context, withUOM = true) {
    return OnlineGetCharacteristicValues(context).then(values => {
        const charDisplayValues = values.map(val => charValue(context, val, withUOM));
        return prettyPrint(charDisplayValues);
    });
}
