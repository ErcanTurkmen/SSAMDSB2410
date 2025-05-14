import ValidationLibrary from '../../../Common/Library/ValidationLibrary';
import { ChangeExistingDescriptionTypes } from './ChangeExistingDescriptionPickerItems';
import { GetStandardTextKey } from './StandardTextPickerOnChanged';

export default async function STKExistingPickerOnChanged(context) {
    const pageProxy = context.getPageProxy();
    const fcContainer = pageProxy.getControl('FormCellContainer');
    const stkPicker = fcContainer.getControl('StandardTextKeyListPicker');
    const pickedSTK = !ValidationLibrary.evalIsEmpty(stkPicker.getValue()) && stkPicker.getValue()[0].ReturnValue;
    const pickedStrOp = !ValidationLibrary.evalIsEmpty(context.getValue()) && context.getValue()[0].ReturnValue;  // replace or append
    if (!pickedSTK || !pickedStrOp) {
        return undefined;
    }

    return SetupDescriptionAndNote(context, fcContainer, pickedSTK, pickedStrOp);
}

async function SetupDescriptionAndNote(context, fcContainer, pickedSTKkey, pickedStrOp) {
    const pageProxy = context.getPageProxy();
    const descriptionControl = fcContainer.getControl('DescriptionNote');

    const stk = await GetStandardTextKey(context, pickedSTKkey);

    if (pickedStrOp === ChangeExistingDescriptionTypes.replace) {
        // replace shorttext, if the stk string is 40+ long, add it to the longtext too (create or append)
        descriptionControl.setValue(stk.LongText.substring(0, 40));

        if (40 < stk.LongText.length) {
            setLongtext(fcContainer, stk.LongText);
        }
    } else if (pickedStrOp === ChangeExistingDescriptionTypes.append) {
        // append: shortText should not be changed, just the longtext (create or append)
        descriptionControl.setValue(pageProxy.binding.OperationShortText ? pageProxy.binding.OperationShortText : '');
        setLongtext(fcContainer, stk.LongText);
    }
}

function setLongtext(fcContainer, string) {
    const longtextControl = fcContainer.getControl('LongTextNote');
    longtextControl.setValue(string);
}
