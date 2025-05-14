import libCom from '../Common/Library/CommonLibrary';
import libLocationTracking from '../LocationTracking/LocationTrackingLibrary';
import libVal from '../Common/Library/ValidationLibrary';
import LocationTrackingToggle from './LocationTrackingToggle';
import ResetValidationOnInput from '../Common/Validation/ResetValidationOnInput';

/**
* Set LocationTracking Switch value based on chosen persona
* @param {IClientAPI} clientAPI
*/
export default function SetLocationSwitch(context) {
    ResetValidationOnInput(context);
    let persona = libCom.getListPickerValue(context.getValue());

    let isTrackingEnabled = libLocationTracking.getUserSwitch(context, persona);
    context.getPageProxy().evaluateTargetPath('#Control:LocationTrackingSwitch').setEditable(!libVal.evalIsEmpty(isTrackingEnabled));

    let switchValue = isTrackingEnabled === 'on' ? true : false;
    context.getPageProxy().evaluateTargetPath('#Control:LocationTrackingSwitch').setValue(switchValue);

    return LocationTrackingToggle(context, persona, switchValue);
}
