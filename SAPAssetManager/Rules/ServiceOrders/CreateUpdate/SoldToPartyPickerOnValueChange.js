import ResetValidationOnInput from '../../Common/Validation/ResetValidationOnInput';
import ServiceOrderControlsLibrary from '../S4ServiceOrderControlsLibrary';

export default function SoldToPartyPickerOnValueChange(control) {
    ResetValidationOnInput(control);
    ServiceOrderControlsLibrary.updateBillToParty(control);
    ServiceOrderControlsLibrary.updateSalesOrg(control);
    ServiceOrderControlsLibrary.updateServiceOrg(control);
}
