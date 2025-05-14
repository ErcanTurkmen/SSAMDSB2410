import CommonLibrary from '../../../Common/Library/CommonLibrary';
import ValidationLibrary from '../../../Common/Library/ValidationLibrary';
import { ChangeExistingDescriptionTypes } from './ChangeExistingDescriptionPickerItems';
import STKExistingPickerOnChanged from './STKExistingPickerOnChanged';

export default function StandardTextPickerOnChanged(context) {
    const pageProxy = context.getPageProxy();
    const isOnCreate = CommonLibrary.IsOnCreate(pageProxy);
    const fcContainer = pageProxy.getControl('FormCellContainer');

    const pickedSTK = !ValidationLibrary.evalIsEmpty(context.getValue()) && context.getValue()[0].ReturnValue;

    const segmentedControl = fcContainer.getControl('ChangeExistingDescriptionSegmented');
    if (!pickedSTK) {  // deselect stk: disable str op segmented if visible, revert shorttext and note to original
        if (segmentedControl.visible) {
            segmentedControl.setEditable(false);
        }
        const descriptionControl = fcContainer.getControl('DescriptionNote');
        descriptionControl.setValue(pageProxy.binding.OperationShortText ? pageProxy.binding.OperationShortText : '');
        const noteControl = fcContainer.getControl('LongTextNote');
        noteControl.setValue('');
        return Promise.resolve();
    }

    if (!isOnCreate && pickedSTK) {  // edit
        segmentedControl.setVisible(true);
        segmentedControl.setEditable(true);
        const strOpValue = !ValidationLibrary.evalIsEmpty(segmentedControl.getValue()) && segmentedControl.getValue()[0].ReturnValue;
        const valueChanged = strOpValue !== ChangeExistingDescriptionTypes.replace;
        segmentedControl.setValue(ChangeExistingDescriptionTypes.replace);
        if (!valueChanged) {
            STKExistingPickerOnChanged(segmentedControl);
        }
    }
    return (isOnCreate && pickedSTK) ? SetupDescriptionAndNote(context, fcContainer, pickedSTK) : undefined;
}


async function SetupDescriptionAndNote(context, fcContainer, pickedSTKkey) {
    const descriptionControl = fcContainer.getControl('DescriptionNote');
    const noteControl = fcContainer.getControl('LongTextNote');
    const charLimit = parseInt(CommonLibrary.getAppParam(context, 'WORKORDER', 'DescriptionLength'));

    const stk = await GetStandardTextKey(context, pickedSTKkey);

    descriptionControl.setValue(stk.LongText.substring(0, charLimit));
    noteControl.setValue(charLimit < stk.LongText.length ? stk.LongText : '');
}

export function GetStandardTextKey(context, pickedSTKkey) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', `StandardTextKeys('${pickedSTKkey}')`, [], '')
        .then(pickedItem => pickedItem.getItem(0));
}

