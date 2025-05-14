import CommonLibrary from '../../Common/Library/CommonLibrary';
import LocalizationLibrary from '../../Common/Library/LocalizationLibrary';
import StartValidation from './ValidationRules/StartValidation';
import LengthValidation from './ValidationRules/LengthValidation';

/** @param {IButtonFormCellProxy} controlProxy */
export default function LAMCreateUpdateCalculateLengthStartEndPoint(controlProxy) {
    const section = CommonLibrary.GetParentSection(controlProxy);
    const [start, end, length] = ['StartPoint', 'EndPoint', 'Length'].map(n => section.getControl(n));
    const [startVal, endVal] = [start, end].map(c => c.getValue());

    SetStartPointEndPointLength(startVal, endVal, controlProxy, length);

    if (startVal || endVal) {
        CommonLibrary.clearValidationOnInput(controlProxy);
    }
    StartValidation(controlProxy, start, startVal, length.getValue());
}

export function SetStartPointEndPointLength(startVal, endVal, context, length) {
    const lengthVal = [startVal, endVal].every(v => LocalizationLibrary.isNumber(context, v)) ? Math.abs(LocalizationLibrary.toNumber(context, endVal) - LocalizationLibrary.toNumber(context, startVal)) : 0;
    length.setValue(context.formatNumber(lengthVal, '', { useGrouping: false }));
    return LengthValidation(context, length, lengthVal);
}
