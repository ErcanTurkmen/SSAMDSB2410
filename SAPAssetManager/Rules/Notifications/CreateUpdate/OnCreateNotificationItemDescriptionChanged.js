import ResetValidationOnInput from '../../Common/Validation/ResetValidationOnInput';
import NotificationDescriptionLengthValidation from '../Utils/NotificationDescriptionLengthValidation';
import UpdateCauseGroupEditable from './UpdateCauseGroupEditable';

export default function OnCreateNotificationItemDescriptionChanged(control) {
    ResetValidationOnInput(control);
    NotificationDescriptionLengthValidation(control);
    // 'Cause Group' is allowed for input only if DamageDetailsLstPkr || PartDetailsLstPkr || ItemDescription was entered or exists
    UpdateCauseGroupEditable(control);
}
