import StartValidation from './ValidationRules/StartValidation';
import EndValidation from './ValidationRules/EndValidation';
import LengthValidation from './ValidationRules/LengthValidation';
import CommonLibrary from '../../Common/Library/CommonLibrary';

/** @param {IFormCellProxy} controlProxy */
export default function LAMCreateUpdateValuesChangedDataCaptureLength(controlProxy) {
    const section = CommonLibrary.GetParentSection(controlProxy);
    const [[start, startVal], [end, endVal], [length, lengthVal]] = ['StartPoint', 'EndPoint', 'Length']
        .map(n => section.getControl(n))
        .map(c => [c, c.getValue()]);

    StartValidation(controlProxy, start, startVal, lengthVal);
    EndValidation(controlProxy, end, endVal, lengthVal);
    LengthValidation(controlProxy, length, lengthVal);
}
