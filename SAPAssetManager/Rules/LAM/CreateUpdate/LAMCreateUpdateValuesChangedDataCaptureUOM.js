import CommonLibrary from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';
import StartValidation from './ValidationRules/StartValidation';
import EndValidation from './ValidationRules/EndValidation';
import LengthValidation from './ValidationRules/LengthValidation';


/** @param {IFormCellProxy} controlProxy */
export default function LAMCreateUpdateValuesChangedDataCaptureUOM(controlProxy) {
    const section = CommonLibrary.GetParentSection(controlProxy);
    const [[start, startVal], [end, endVal], [length, lengthVal], [uom, uomVal], [uomMarker, uomMarkerVal]] = ['StartPoint', 'EndPoint', 'Length', 'UOMLstPkr', 'MarkerUOMLstPkr']
        .map(n => section.getControl(n))
        .map(c => [c, c.getValue()]);

    [uomVal, uomMarkerVal].forEach(thirdFieldVal => {
        StartValidation(controlProxy, start, startVal, thirdFieldVal);
        EndValidation(controlProxy, end, endVal, thirdFieldVal);
    });

    LengthValidation(controlProxy, length, lengthVal);
    CheckListPickerValue(controlProxy, uom, uomVal);
    CheckListPickerValue(controlProxy, uomMarker, uomMarkerVal);
}

function CheckListPickerValue(context, control, value) {
    if (libVal.evalIsEmpty(CommonLibrary.getListPickerValue(value))) {
        let message = context.localizeText('field_is_required');
        CommonLibrary.executeInlineControlError(context, control, message);
    }
}
