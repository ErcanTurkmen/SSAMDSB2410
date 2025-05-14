import ResetValidationOnInput from '../Common/Validation/ResetValidationOnInput';

export default function StorageLocationOnValueChange(context) {
    ResetValidationOnInput(context);
    let serialNumListPicker = context.getPageProxy().evaluateTargetPathForAPI('#Control:SerialNumLstPkr');
    serialNumListPicker.reset();
 }
