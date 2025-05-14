import CommonLibrary from '../../../Common/Library/CommonLibrary';

export default function SetParentItemPickerValue(context) {
    const binding = context.binding || {};
    return !CommonLibrary.IsOnCreate(context) && binding.HigherLvlItem ? binding.HigherLvlItem.slice(-6) : '';
}
