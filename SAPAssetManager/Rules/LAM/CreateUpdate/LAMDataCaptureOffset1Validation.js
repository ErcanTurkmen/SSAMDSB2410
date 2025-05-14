import CommonLibrary from '../../Common/Library/CommonLibrary';
import StartValidation from './ValidationRules/StartValidation';
import EndValidation from './ValidationRules/EndValidation';
import LengthValidation from './ValidationRules/LengthValidation';
import OffsetsValidation from './ValidationRules/OffsetsValidation';
import Offset2TypeValidation from './ValidationRules/Offset2TypeValidation';


export default function LAMDataCaptureOffset1Validation(controlProxy) {
    const section = CommonLibrary.GetParentSection(controlProxy);
    const [[start, startVal], [end, endVal], [length, lengthVal], [offset1Type, offset1TypeVal], [offset2Type, offset2TypeVal], [, offset1Val], [, offset2Val]] = ['StartPoint', 'EndPoint', 'Length', 'Offset1TypeLstPkr', 'Offset2TypeLstPkr', 'Offset1', 'Offset2'] // eslint-disable-line no-unused-vars
        .map(n => section.getControl(n))
        .map(c => [c, c.getValue()]);

    [offset1TypeVal, offset2TypeVal, offset1Val, offset2Val].forEach(v => {
        StartValidation(controlProxy, start, startVal, CommonLibrary.isDefined(v));
        EndValidation(controlProxy, end, endVal, CommonLibrary.isDefined(v));
    });
    const [offset1TypeSingleVal, offset2TypeSingleVal] = [offset1TypeVal, offset2TypeVal].map(v => v.find(i => i));
    LengthValidation(controlProxy, length, lengthVal);
    if (offset1TypeSingleVal && offset2TypeSingleVal) {
        OffsetsValidation(controlProxy, offset1Type, offset2Type);
    } else if (offset1TypeSingleVal || offset2TypeSingleVal) {  // xor
        (offset1Type || offset2Type).clearValidation();
    }

    Offset2TypeValidation(controlProxy, offset1Type, offset1Val, offset1TypeSingleVal);
    Offset2TypeValidation(controlProxy, offset2Type, offset2Val, offset2TypeSingleVal);
}
