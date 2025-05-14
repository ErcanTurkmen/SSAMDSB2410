import ResetValidationOnInput from '../../Common/Validation/ResetValidationOnInput';
import UpdateCauseGroupEditable from './UpdateCauseGroupEditable';

export default function OnCauseGroupRelatedLstPkrChanged(context) {
    // 'Cause Group' is allowed for input only if DamageDetailsLstPkr || PartDetailsLstPkr entity was entered or exists
    ResetValidationOnInput(context);
    UpdateCauseGroupEditable(context);

    let causeCodePicker = context.getPageProxy().evaluateTargetPathForAPI('#Control:CodeLstPkr');
    let causeGroupPicker = context.getPageProxy().evaluateTargetPath('#Control:CauseGroupLstPkr');
    let causeGroupPickerValue = causeGroupPicker.getValue().length;
    causeCodePicker.setEditable(causeGroupPicker.editable && causeGroupPickerValue);
}

